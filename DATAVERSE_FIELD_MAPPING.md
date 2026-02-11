# Dataverse Field Mapping Guide

This document describes the mapping between Bryntum Gantt task properties and Dataverse table fields.

## Field Mapping Table

| Bryntum Property | Dataverse Field | Type | Description |
|------------------|----------------|------|-------------|
| `id` | `eppm_projecttaskid` | GUID (Primary Key) | Unique task identifier |
| `name` | `eppm_name` | Single Line of Text | Task name/title |
| `startDate` | `eppm_startdate` | Date and Time | Task start date |
| `endDate` | `eppm_finishdate` | Date and Time | Task end date |
| `duration` | `eppm_taskduration` | Whole Number | Task duration in days |
<!-- | `percentDone` | `eppm_percentcomplete` | Whole Number | Completion percentage (0-100) | -->
| `parentId` | `eppm_parenttaskid` | Lookup (Self-reference) | Parent task reference |
<!-- | `expanded` | `eppm_expanded` | Two Options (Boolean) | Whether task is expanded in tree view | -->
<!-- | `constraintType` | `eppm_constrainttype` | Option Set | Task constraint type |
| `constraintDate` | `eppm_constraintdate` | Date and Time | Constraint date |
| `notes` | `eppm_notes` | Multiple Lines of Text | Task notes/description | -->
<!-- | N/A | `eppm_sortorder` | Whole Number | Sort order for hierarchical display | -->

## Constraint Type Mapping

Bryntum constraint types are mapped to Dataverse option set values:

| Bryntum Value | Dataverse Value | Description |
|---------------|-----------------|-------------|
| `startnoearlierthan` | 0 | Start No Earlier Than |
| `startnolaterthan` | 1 | Start No Later Than |
| `finishnoearlierthan` | 2 | Finish No Earlier Than |
| `finishnolaterthan` | 3 | Finish No Later Than |
| `muststarton` | 4 | Must Start On |
| `mustfinishon` | 5 | Must Finish On |

## Customizing Field Names

If your Dataverse table uses different field names, update the mapping in:

1. **Backend**: `server/src/utils/dataTransformer.ts`
   - Modify `dataverseToBryntumTask()` function
   - Modify `bryntumToDataverseTask()` function

2. **Backend**: `server/src/services/dataverse.service.ts`
   - Update `DataverseTask` interface
   - Update field references in service methods

## Example: Custom Field Names

If your table uses `task_name` instead of `eppm_name`:

```typescript
// In dataTransformer.ts
export function dataverseToBryntumTask(dataverseTask: DataverseTask): BryntumTask {
    return {
        name: dataverseTask.task_name || '', // Changed from eppm_name
        // ... other fields
    };
}

export function bryntumToDataverseTask(bryntumTask: BryntumTask): Partial<DataverseTask> {
    const dataverseTask: Partial<DataverseTask> = {};
    
    if (bryntumTask.name !== undefined) {
        dataverseTask.task_name = bryntumTask.name; // Changed from eppm_name
    }
    // ... other fields
}
```

## Required vs Optional Fields

### Required Fields
- `eppm_projecttaskid` (auto-generated)
- `eppm_name` (should be required in Dataverse)

### Optional Fields
All other fields are optional and can be null/empty.

## Data Type Considerations

### Dates
- Dataverse stores dates in UTC ISO 8601 format
- Bryntum expects dates in ISO date format (YYYY-MM-DD)
- Conversion is handled automatically in `dataTransformer.ts`

### Numbers
- `eppm_taskduration`: Stored as whole number (days)
<!-- - `eppm_percentcomplete`: Stored as whole number (0-100) -->
<!-- - `eppm_sortorder`: Stored as whole number -->

### Lookups
- `eppm_parenttaskid`: Must reference the same table (`eppm_projecttasks`)
- Set up as self-referential relationship in Dataverse

## Validation Rules

Consider adding these validation rules in Dataverse:

1. **Percent Complete**: 0-100 range
2. **Duration**: Must be >= 0
3. **End Date**: Must be >= Start Date (if both provided)
4. **Parent Task**: Cannot reference itself

## Testing Field Mapping

To test if field mapping is correct:

1. Create a task in Bryntum Gantt
2. Check Dataverse table for the record
3. Verify all fields are mapped correctly
4. Update task in Bryntum
5. Verify changes appear in Dataverse
6. Update task in Dataverse
7. Refresh Bryntum and verify changes appear

## Troubleshooting Field Mapping

### Issue: Fields not saving
- Check field names match exactly (case-sensitive)
- Verify field exists in Dataverse table
- Check field permissions (read/write)

### Issue: Wrong data types
- Verify Dataverse field types match expected types
- Check date format conversions
- Verify number fields accept the range of values

### Issue: Lookup not working
- Verify self-referential relationship is set up
- Check lookup field name matches
- Ensure parent task ID exists
