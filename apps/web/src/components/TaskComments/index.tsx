import { useState, type Dispatch, type SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Comments } from "@/types";
import { useUserStore } from "@/stores";

type TaskCommentsProps = {
    comments: Comments[];
    setPage: Dispatch<SetStateAction<number>>;
    onAddComment: (text: string) => Promise<void>;
};

export function TaskComments({ comments, setPage, onAddComment }: TaskCommentsProps) {

    const user = useUserStore((state) => state.find)
    

    const [newComment, setNewComment] = useState("");
    const [isSending, setIsSending] = useState(false);

    async function handleSend() {
        if (!newComment.trim()) return;

        try {
            setIsSending(true);
            await onAddComment(newComment);
            setNewComment("");
        } finally {
            setIsSending(false);
        }
    }

    function loadMore() {
        setPage(prev => prev + 1);
    }

    return (
        <div className="flex flex-col gap-3">
            <ScrollArea className="h-40 rounded-md border border-gray-700 bg-[#111] p-3">
                <div className="space-y-3">
                    {comments?.length ? (
                        comments.map((c) => (
                            <div
                                key={c.id}
                                className="bg-[#1c1c1c] border border-gray-700 p-2 rounded-md"
                            >
                                <span className="text-xs text-gray-500">
                                    {c.user?.email || user(c.user_id)?.userEmail}
                                </span>
                                <p className="text-sm text-gray-200">{c.content}</p>

                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">Nenhum comentário ainda.</p>
                    )}
                </div>
            </ScrollArea>

            {comments?.length > 0 && (
                <Button
                    className="bg-gray-700 hover:bg-gray-600 text-white w-full"
                    onClick={loadMore}
                >
                    Carregar mais
                </Button>
            )}

            <Separator className="bg-gray-700" />
            <div className="flex w-full gap-2">
                <Input
                    placeholder="Adicionar comentário..."
                    className="flex-1 bg-[#1A1A1A] border-gray-700 text-white"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />

                <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSend}
                    disabled={isSending || !newComment.trim()}
                >
                    {isSending ? "Enviando..." : "Enviar"}
                </Button>
            </div>
        </div>
    );
}
