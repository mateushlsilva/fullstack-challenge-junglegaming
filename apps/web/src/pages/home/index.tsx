import { useTaskQuery } from "@/hooks"
import { useTaskStore } from "@/stores";
import { useEffect, useState } from "react";
import { SkeletonKanbanBoard, TaskKanban } from "@/components";
import { HomeTemplate } from "@/templates";


function useIsBottom(offset = 100) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - offset;

      setIsBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return isBottom;
}


function Home() {
    const [ page, setPage ] = useState(1)
    const { isPending  } = useTaskQuery({page: page, size: 20})
    if (isPending) console.log("Ta pegando")
    const tasks = useTaskStore((e) => e.tasks)
    console.log(page);
    
    const isBottom = useIsBottom(200);
  

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  if (isBottom) setPage((prev) => prev + 1)
}, [isBottom]);

    return (
        <HomeTemplate>
          <div className="mr-2 ml-2">
          { isPending ? <SkeletonKanbanBoard/> : <TaskKanban tasks={tasks}/> }
          </div>
        </HomeTemplate>
    )
}

export default Home