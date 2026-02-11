// Type declarations for Bryntum Gantt UMD bundle
// This file provides TypeScript types for the global Bryntum object

declare global {
  interface Window {
    Bryntum: {
      Gantt: any;
      GanttReact: {
        BryntumGantt: React.ComponentType<any>;
        BryntumDemoHeader: React.ComponentType<any>;
      };
      // Add other Bryntum exports as needed
      [key: string]: any;
    };
  }
}

// Re-export types for convenience
export type BryntumGantt = any;
export type BryntumGanttProps = any;
export type Gantt = any;
export type TaskModel = any;
