import { create } from "zustand";
import type { GetTaskAssigneesAndCommentsType, TaskToKanban } from "@/types";
import { PriorityEnum, StatusEnum } from "@/enums";

type TaskStore = {
  tasks: TaskToKanban[]
  filteredTasks: TaskToKanban[],
  addPage: (newTasks: GetTaskAssigneesAndCommentsType[]) => void
  clear: () => void
  updateTask: (id: string, data: Partial<TaskToKanban>) => void
  removeTask: (id: string) => void
  filter: (priority: PriorityEnum | null) => void
}


function mapTaskToKanban(taskFromAPI: GetTaskAssigneesAndCommentsType) {
  return {
    id: taskFromAPI.id.toString(),
    name: taskFromAPI.taskTitle ?? taskFromAPI.taskTitle,
    description: taskFromAPI.taskDescription ?? taskFromAPI.taskDescription,
    dueDate: taskFromAPI.taskDueDate ?? new Date(),
    priority: taskFromAPI.taskPriority ?? PriorityEnum.LOW,
    column: taskFromAPI.taskStatus ?? StatusEnum.TODO,
    comment: taskFromAPI.comments ?? [],
    assignees: taskFromAPI.assignees ?? []
  }
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  filteredTasks: [],
  addPage: (newTasks) =>
    set((state) => {
      const mapped = newTasks.map(mapTaskToKanban);

      const existingIds = new Set(state.tasks.map(t => t.id));

      const filtered = mapped.filter(task => !existingIds.has(task.id));

      return { tasks: [...state.tasks, ...filtered], filteredTasks: [...state.tasks, ...filtered] };
  }),
  clear: () => set({ filteredTasks: [], tasks: [] }),

  updateTask: (id, data) =>
    set((state) => ({
      filteredTasks: state.filteredTasks.map((t) => t.id === id ? { ...t, ...data } : t),
      tasks: state.tasks.map((t) => t.id === id ? { ...t, ...data } : t),
    })),

  removeTask: (id) =>
    set((state) => ({
      filteredTasks: state.filteredTasks.filter((t) => t.id !== id),
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

 filter: (priority) => 
    set((state) => ({
      tasks: priority ? state.filteredTasks.filter(t => t.priority === priority) : state.filteredTasks
    })),
}))