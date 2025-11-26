import { create } from "zustand";
import type { GetTaskAssigneesAndCommentsType, TaskToKanban } from "@/types";
import { PriorityEnum, StatusEnum } from "@/enums";

type TaskStore = {
  tasks: TaskToKanban[]
  addPage: (newTasks: GetTaskAssigneesAndCommentsType[]) => void
  clear: () => void
  updateTask: (id: string, data: Partial<TaskToKanban>) => void
  removeTask: (id: string) => void
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
  addPage: (newTasks) =>
    set((state) => ({
      tasks: [...state.tasks, ...newTasks.map(mapTaskToKanban)]
    })),
  clear: () => set({ tasks: [] }),
  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...data } : t
      )
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id)
    })),
}))