import { io, Socket } from "socket.io-client";
import { env } from "@/env";
import { useAuthStore, useTaskStore } from "@/stores";
import { useEffect } from "react";
import type { CreateTaskEvent, UpdateTaskEvent, CreateCommentEvent } from '@/events';
import type { GetTaskAssigneesAndCommentsType, Comments } from "@/types";

interface Payload {
    id: number;
    message: string;
    data: CreateTaskEvent | UpdateTaskEvent | CreateCommentEvent;
}

export function useAuthWebSocket() {

    const token = useAuthStore((state) => state.token)
    const addTasks = useTaskStore((state) => state.addPage)
    const updateTask = useTaskStore((state) => state.updateTask)

    useEffect(() => {
        if (!token) return;

    

    const socket: Socket = io(env.wsUrl, {
        extraHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    socket.on("connect", () => {
        console.log("Conectado!", socket.id);
    });

    socket.on("task:created", (data: Payload) => {
        console.log("Notificação recebida:", data);
        const { assigned_user_ids, id, taskDescription, taskDueDate, taskPriority, taskStatus, taskTitle } = data.data as CreateTaskEvent;
        let assignedIdCounter = 1;
          const assigned = assigned_user_ids.map((user) => ({
            user_id: user.toString(),
            assigned_at: new Date(),
            id: assignedIdCounter ++,
        }));
        const newData: GetTaskAssigneesAndCommentsType = { 
            id, 
            taskDescription, 
            taskDueDate, 
            taskPriority, 
            taskStatus, 
            taskTitle, 
            comments: [] as Comments[], 
            assignees: assigned, 
            created_at: new Date(), 
            updated_at: new Date()
        }
        addTasks([newData])
        socket.emit("notification:received", data.id );
    });

    socket.on("task:updated", (data: Payload) => {
        console.log("Notificação recebida:", data);
        socket.emit("notification:received", data.id );
    });

    socket.on("comment:new", (data: Payload) => {
        console.log("Notificação recebida:", data);
        console.log("O id foi muito bem entrege olha ele: ", data.id);

        const { task_id, user_id , id ,content } = data.data as CreateCommentEvent

        updateTask(task_id.toString(), {
            comment: [
                ...useTaskStore.getState().tasks.find(t => t.id === task_id.toString())!.comment,
                {
                id,
                content,
                user_id: user_id.toString(),
                created_at: new Date()
                }
            ]
        })

        socket.emit("notification:received", data.id );
    });

    return () => {
      socket.disconnect();
    };
    }, [token])


}
