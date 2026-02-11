import { DataverseTask} from '../services/dataverse.service.js';
// DataverseDependency

/**
 * Format a date string to YYYY-MM-DD (date-only, timezone-safe).
 * Uses noon UTC when parsing to avoid day shift across timezones.
 */
function formatDateToYYYYMMDD(dateString: string | null | undefined): string | undefined {
    if (!dateString) return undefined;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return undefined;
        const y = date.getUTCFullYear();
        const m = String(date.getUTCMonth() + 1).padStart(2, '0');
        const d = String(date.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    } catch (e) {
        return undefined;
    }
}

/**
 * Safely convert a date value to ISO string. Returns undefined if invalid.
 * Prevents "Invalid time value" errors when Date parsing fails.
 * Accepts: string, Date, number (timestamp), null, undefined.
 */
function toSafeISOString(value: string | Date | number | null | undefined): string | undefined {
    if (value == null || value === '') return undefined;
    try {
        const date = value instanceof Date ? value : new Date(value as string | number);
        if (isNaN(date.getTime())) return undefined;
        return date.toISOString();
    } catch (e) {
        return undefined;
    }
}

/**
 * Add days to a YYYY-MM-DD date string. Used to convert inclusive finish date -> Bryntum exclusive end date.
 * Returns empty string if input is invalid.
 */
function addDaysToDateString(dateStr: string, days: number): string {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const date = new Date(dateStr + 'T12:00:00Z');
    if (isNaN(date.getTime())) return '';
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().split('T')[0];
}

/**
 * Subtract days from a YYYY-MM-DD date string. Used to convert Bryntum exclusive end date -> inclusive finish date.
 * Returns empty string if input is invalid.
 */
function subtractDaysFromDateString(dateStr: string, days: number): string | undefined {
    if (!dateStr || typeof dateStr !== 'string') return undefined;
    const date = new Date(dateStr + 'T12:00:00Z');
    if (isNaN(date.getTime())) return undefined;
    date.setUTCDate(date.getUTCDate() - days);
    return date.toISOString().split('T')[0];
}

export interface BryntumTask {
    id?: number | string;
    projectId?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    duration?: number;
    durationUnit?: string;
    percentDone?: number;
    effort?: number;
    effortUnit?: string;
    parentId?: number | string;
    expanded?: boolean;
    children?: BryntumTask[];
    constraintType?: string;
    constraintDate?: string;
    // Notes shown in Bryntum task editor (Notes tab). Bryntum commonly uses `note`,
    // but we also expose `notes` for compatibility with existing code.
    note?: string;
    // notes?: string;
    // Optional custom field to surface stored successors string
    successors?: string;
    // Advanced features
    calendar?: string; // Calendar ID or name
    ignoreResourceCalendar?: boolean; // Ignore resource calendar toggle
    schedulingMode?: string; // 'normal' | 'fixedduration' | 'fixedunits' | 'fixedeffort'
    effortDriven?: boolean; // Effort driven toggle
    rollup?: boolean; // Rollup toggle
    inactive?: boolean; // Inactive toggle
    manuallyScheduled?: boolean; // Manually scheduled toggle
    projectBorder?: string; // 'honor' | 'ignore' | 'askuser'
    isCritical?: boolean; // Critical path flag
    [key: string]: any;
}

export interface BryntumDependency {
    id?: number | string;
    fromTask?: number | string;
    toTask?: number | string;
    lag?: number;
}

export interface BryntumProjectData {
    success: boolean;
    project?: {
        calendar?: string;
        startDate?: string;
        hoursPerDay?: number;
        daysPerWeek?: number;
        daysPerMonth?: number;
    };
    tasks?: {
        rows: BryntumTask[];
    };
    dependencies?: {
        rows: BryntumDependency[];
    };
    calendars?: any;
    resources?: any;
    assignments?: any;
    timeRanges?: any;
}

/**
 * Transform Dataverse task to Bryntum format
 */
export function dataverseToBryntumTask(dataverseTask: DataverseTask): BryntumTask {
    // Dataverse stores inclusive finish date (last day of task). Bryntum uses exclusive end date (day after last day).
    // So we send startDate as-is, and endDate = finishDate + 1 day so that duration matches (e.g. 5 days, start Feb 4, finish Feb 10 -> endDate Feb 11).
    const startDateStr = formatDateToYYYYMMDD(dataverseTask.eppm_startdate);
    const finishDateStr = formatDateToYYYYMMDD(dataverseTask.eppm_finishdate);
    const endDateForBryntum = finishDateStr ? addDaysToDateString(finishDateStr, 1) : undefined;

    const bryntumTask: BryntumTask = {
        id: dataverseTask.eppm_projecttaskid || undefined,
        projectId: (dataverseTask as any).eppm_projectid ?? undefined,
        name: dataverseTask.eppm_name || 'Unnamed Task',
        startDate: startDateStr,
        endDate: endDateForBryntum,
        duration: dataverseTask.eppm_taskduration || undefined,
        durationUnit: 'day',
        // Dataverse -> Bryntum mapping
        // % complete
        percentDone: (dataverseTask as any).eppm_pocpercentage ?? undefined,
        // effort/work
        effort: (dataverseTask as any).eppm_taskwork ?? undefined,
        effortUnit: 'hour',
        // Notes + Successors
        note: (dataverseTask as any).eppm_notes ?? undefined,
        // notes: (dataverseTask as any).eppm_notes ?? undefined,
        successors: (dataverseTask as any).eppm_successors ?? undefined,
        // Advanced features mapping
        calendar: dataverseTask.eppm_calendarname ?? undefined,
        ignoreResourceCalendar: dataverseTask.eppm_ignoreresourcecalendar ?? undefined,
        // Scheduling mode mapping (Dataverse Option Set number -> Bryntum string)
        schedulingMode: dataverseTask.eppm_schedulingmode !== undefined && dataverseTask.eppm_schedulingmode !== null
            ? getSchedulingModeName(dataverseTask.eppm_schedulingmode)
            : undefined,
        effortDriven: dataverseTask.eppm_effortdriven ?? undefined,
        rollup: dataverseTask.eppm_rollup ?? undefined,
        inactive: dataverseTask.eppm_inactive ?? undefined,
        manuallyScheduled: dataverseTask.eppm_manuallyscheduled ?? undefined,
        projectBorder: dataverseTask.eppm_projectborder ?? undefined,
    };

    // Constraint mapping (convert number to Bryntum constraint type string)
    if (dataverseTask.eppm_constrainttype !== undefined && dataverseTask.eppm_constrainttype !== null) {
        bryntumTask.constraintType = getConstraintTypeName(dataverseTask.eppm_constrainttype);
    }
    
    // Constraint date
    if (dataverseTask.eppm_constraintdate) {
        bryntumTask.constraintDate = formatDateToYYYYMMDD(dataverseTask.eppm_constraintdate);
    }

    // Only set parentId if it's not null/undefined
    if (dataverseTask.eppm_parenttaskid) {
        bryntumTask.parentId = dataverseTask.eppm_parenttaskid;
    }

    return bryntumTask;
}

/**
 * Transform Bryntum task to Dataverse format
 */
export function bryntumToDataverseTask(bryntumTask: BryntumTask): Partial<DataverseTask> {
    const dataverseTask: Partial<DataverseTask> = {};

    const projectId = (bryntumTask as any).projectId ?? (bryntumTask as any).eppm_projectid;
    if (typeof projectId === 'string' && projectId.trim()) {
        (dataverseTask as any).eppm_projectid = projectId.trim();
    }

    // Name: support name, taskName, text (Bryntum Task Editor may use different field names)
    const taskName = (bryntumTask as any).name ?? (bryntumTask as any).taskName ?? (bryntumTask as any).text ?? (bryntumTask as any).eppm_name;
    if (taskName !== undefined && taskName !== null) {
        dataverseTask.eppm_name = typeof taskName === 'string' ? taskName : String(taskName);
    }
    if (bryntumTask.startDate && typeof bryntumTask.startDate === 'string' && bryntumTask.startDate.trim()) {
        const startStr = bryntumTask.startDate.trim();
        const startIso = toSafeISOString(startStr.includes('T') ? startStr : startStr + 'T12:00:00Z');
        if (startIso) dataverseTask.eppm_startdate = startIso;
    }
    // Bryntum sends exclusive end date (day after last day). Dataverse expects inclusive finish date (last day).
    // So subtract one day: e.g. endDate Feb 11 -> store finish date Feb 10.
    if (bryntumTask.endDate && typeof bryntumTask.endDate === 'string') {
        const inclusiveFinish = subtractDaysFromDateString(bryntumTask.endDate, 1);
        if (inclusiveFinish) {
            const finishIso = toSafeISOString(inclusiveFinish + 'T12:00:00Z');
            if (finishIso) dataverseTask.eppm_finishdate = finishIso;
        }
    }
    if (bryntumTask.duration !== undefined) {
        dataverseTask.eppm_taskduration = bryntumTask.duration;
    }
    // Bryntum -> Dataverse mapping
    if (bryntumTask.percentDone !== undefined) {
        (dataverseTask as any).eppm_pocpercentage = bryntumTask.percentDone;
    }
    if (bryntumTask.effort !== undefined) {
        (dataverseTask as any).eppm_taskwork = bryntumTask.effort;
    }
    if (bryntumTask.parentId !== undefined && bryntumTask.parentId !== null) {
        dataverseTask.eppm_parenttaskid = typeof bryntumTask.parentId === 'string' 
            ? bryntumTask.parentId 
            : bryntumTask.parentId.toString();
    }
    // if (bryntumTask.expanded !== undefined) {
    //     dataverseTask.eppm_expanded = bryntumTask.expanded;
    // }
    // if (bryntumTask.constraintType) {
    //     dataverseTask.eppm_constrainttype = getConstraintTypeValue(bryntumTask.constraintType);
    // }
    // if (bryntumTask.constraintDate) {
    //     dataverseTask.eppm_constraintdate = new Date(bryntumTask.constraintDate).toISOString();
    // }
    const notes = (bryntumTask as any).notes ?? (bryntumTask as any).note;
    if (typeof notes === 'string') {
        (dataverseTask as any).eppm_notes = notes.trim() === '' ? null : notes;
    }

    const successors = (bryntumTask as any).successors ?? (bryntumTask as any).successor;
    if (typeof successors === 'string') {
        (dataverseTask as any).eppm_successors = successors.trim() === '' ? null : successors;
    }

    // Advanced features mapping (Bryntum -> Dataverse)
    if (bryntumTask.calendar !== undefined) {
        dataverseTask.eppm_calendarname = bryntumTask.calendar || undefined;
    }
    if (bryntumTask.ignoreResourceCalendar !== undefined) {
        dataverseTask.eppm_ignoreresourcecalendar = bryntumTask.ignoreResourceCalendar;
    }
    // Scheduling mode mapping (Bryntum string -> Dataverse Option Set number)
    if (bryntumTask.schedulingMode !== undefined && bryntumTask.schedulingMode !== null) {
        dataverseTask.eppm_schedulingmode = getSchedulingModeValue(bryntumTask.schedulingMode);
    }
    if (bryntumTask.effortDriven !== undefined) {
        dataverseTask.eppm_effortdriven = bryntumTask.effortDriven;
    }
    if (bryntumTask.rollup !== undefined) {
        dataverseTask.eppm_rollup = bryntumTask.rollup;
    }
    if (bryntumTask.inactive !== undefined) {
        dataverseTask.eppm_inactive = bryntumTask.inactive;
    }
    if (bryntumTask.manuallyScheduled !== undefined) {
        dataverseTask.eppm_manuallyscheduled = bryntumTask.manuallyScheduled;
    }
    if (bryntumTask.projectBorder !== undefined) {
        dataverseTask.eppm_projectborder = bryntumTask.projectBorder;
    }
    
    // Constraint mapping (convert Bryntum constraint type string to number)
    if (bryntumTask.constraintType) {
        dataverseTask.eppm_constrainttype = getConstraintTypeValue(bryntumTask.constraintType);
    }
    if (bryntumTask.constraintDate) {
        const constraintIso = toSafeISOString(bryntumTask.constraintDate);
        if (constraintIso) dataverseTask.eppm_constraintdate = constraintIso;
    }

    return dataverseTask;
}

/**
 * Build hierarchical task structure from flat list
 */
export function buildTaskHierarchy(tasks: DataverseTask[]): BryntumTask[] {
    const taskMap = new Map<string, BryntumTask>();
    const rootTasks: BryntumTask[] = [];

    if (!tasks || tasks.length === 0) {
        return rootTasks;
    }

    // First pass: create all tasks
    tasks.forEach(task => {
        if (!task.eppm_projecttaskid) {
            console.warn('Task missing eppm_projecttaskid, skipping:', task);
            return;
        }
        const bryntumTask = dataverseToBryntumTask(task);
        if (bryntumTask.id) {
            taskMap.set(String(bryntumTask.id), bryntumTask);
        }
    });

    // Second pass: build hierarchy
    tasks.forEach(task => {
        if (!task.eppm_projecttaskid) return;
        
        const bryntumTask = taskMap.get(String(task.eppm_projecttaskid));
        if (!bryntumTask) return;

        // If task has a parent
        if (task.eppm_parenttaskid) {
            const parent = taskMap.get(String(task.eppm_parenttaskid));
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(bryntumTask);
            } else {
                // Parent not found in map, treat as root task
                rootTasks.push(bryntumTask);
            }
        } else {
            // No parent, it's a root task
            rootTasks.push(bryntumTask);
        }
    });

    // Sort root tasks and children by start date if available
    const sortTasks = (taskList: BryntumTask[]): BryntumTask[] => {
        return taskList.sort((a, b) => {
            const dateA = a.startDate || '';
            const dateB = b.startDate || '';
            return dateA.localeCompare(dateB);
        }).map(task => {
            if (task.children && task.children.length > 0) {
                task.children = sortTasks(task.children);
            }
            return task;
        });
    };

    return sortTasks(rootTasks);
}

/**
 * Flatten hierarchical task structure to flat list
 */
export function flattenTaskHierarchy(tasks: BryntumTask[], parentId?: string): DataverseTask[] {
    const flatList: DataverseTask[] = [];
    let sortOrder = 0;

    tasks.forEach(task => {
        const dataverseTask: Partial<DataverseTask> = bryntumToDataverseTask(task);
        
        if (task.id) {
            dataverseTask.eppm_projecttaskid = String(task.id);
        }
        
        if (parentId) {
            dataverseTask.eppm_parenttaskid = parentId;
        }
        
        // dataverseTask.eppm_sortorder = sortOrder++;

        flatList.push(dataverseTask as DataverseTask);

        if (task.children && task.children.length > 0) {
            const childTasks = flattenTaskHierarchy(task.children, String(task.id));
            flatList.push(...childTasks);
        }
    });

    return flatList;
}

/**
 * Convert scheduling mode name to Dataverse Option Set value
 * Bryntum uses strings: 'normal', 'fixedduration', 'fixedunits', 'fixedeffort'
 * Dataverse uses Option Set numbers: 100000000, 100000001, 100000002, 100000003
 */
export function getSchedulingModeValue(schedulingMode: string): number {
    const schedulingModeMap: Record<string, number> = {
        'normal': 100000000,        // Normal
        'fixedduration': 100000001, // Fixed Duration
        'fixedunits': 100000002,    // Fixed Units
        'fixedeffort': 100000003    // Fixed Efforts
    };
    return schedulingModeMap[schedulingMode.toLowerCase()] ?? 100000000; // Default to Normal
}

/**
 * Convert Dataverse Option Set value to scheduling mode name
 * Dataverse uses Option Set numbers: 100000000, 100000001, 100000002, 100000003
 * Bryntum uses strings: 'normal', 'fixedduration', 'fixedunits', 'fixedeffort'
 */
export function getSchedulingModeName(schedulingMode: number): string {
    const schedulingModeMap: Record<number, string> = {
        100000000: 'normal',        // Normal
        100000001: 'fixedduration', // Fixed Duration
        100000002: 'fixedunits',   // Fixed Units
        100000003: 'fixedeffort'   // Fixed Efforts
    };
    return schedulingModeMap[schedulingMode] || 'normal'; // Default to normal
}

/**
 * Convert constraint type name to Dataverse Option Set value
 * Bryntum uses constraint type strings, Dataverse uses Option Set numeric values
 * Bryntum values: "assoonaspossible", "aslateaspossible", "startnoearlierthan", etc.
 * Dataverse Option Set values: 100000000-100000007
 */
export function getConstraintTypeValue(constraintType: string): number {
    const constraintMap: Record<string, number> = {
        'assoonaspossible': 100000000, // As Soon As Possible (default)
        'asap': 100000000, // Alias for assoonaspossible
        'aslateaspossible': 100000001, // As Late As Possible
        'alap': 100000001, // Alias for aslateaspossible
        'muststarton': 100000002, // Must Start On
        'mustfinishon': 100000003, // Must Finish On
        'startnoearlierthan': 100000004, // Start No Earlier Than
        'startnolaterthan': 100000005, // Start No Later Than
        'finishnoearlierthan': 100000006, // Finish No Earlier Than
        'finishnolaterthan': 100000007 // Finish No Later Than
    };
    return constraintMap[constraintType.toLowerCase()] ?? 100000000; // Default to As Soon As Possible
}

/**
 * Convert Dataverse Option Set value to constraint type name
 * Dataverse uses Option Set numeric values (100000000-100000007), Bryntum uses constraint type strings
 * Returns Bryntum's expected format: "assoonaspossible", "aslateaspossible", etc.
 */
export function getConstraintTypeName(constraintType: number): string {
    const constraintMap: Record<number, string> = {
        100000000: 'assoonaspossible', // As Soon As Possible (default)
        100000001: 'aslateaspossible', // As Late As Possible
        100000002: 'muststarton', // Must Start On
        100000003: 'mustfinishon', // Must Finish On
        100000004: 'startnoearlierthan', // Start No Earlier Than
        100000005: 'startnolaterthan', // Start No Later Than
        100000006: 'finishnoearlierthan', // Finish No Earlier Than
        100000007: 'finishnolaterthan' // Finish No Later Than
    };
    return constraintMap[constraintType] || 'assoonaspossible';
}
