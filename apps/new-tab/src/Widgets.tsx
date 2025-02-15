import { createSignal } from "solid-js";
import { Checkbox, CheckboxControl } from "./components/ui/checkbox";
import { TextField, TextFieldRoot } from "./components/ui/textfield";

function TodoPopover() {
  interface Task {
    completed: boolean;
    title: string;
    id: string;
  }

  const getInitialTasks = () => {
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((task: Task) => ({
          ...task,
          id: task.id || crypto.randomUUID(),
        }));
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
    }
    return [
      { completed: false, title: "Task 1", id: crypto.randomUUID() },
      { completed: false, title: "Task 2", id: crypto.randomUUID() },
    ];
  };

  const [tasks, setTasks] = createSignal<Task[]>(getInitialTasks());

  const [taskInputValue, setTaskInputValue] = createSignal("");
  const [draggedTaskId, setDraggedTaskId] = createSignal<string | null>(null);

  const handleDragStart = (e: DragEvent, taskId: string) => {
    if (!(e.target instanceof HTMLElement)) return;

    setDraggedTaskId(taskId);
    e.dataTransfer?.setData("text/plain", taskId);

    e.target.classList.add("opacity-50");

    const dragImage = e.target.cloneNode(true) as HTMLElement;
    dragImage.classList.add("fixed", "top-0", "left-0", "pointer-events-none");
    document.body.appendChild(dragImage);
    e.dataTransfer?.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  };

  const handleDragEnd = (e: DragEvent) => {
    if (!(e.target instanceof HTMLElement)) return;
    e.target.classList.remove("opacity-50");
    setDraggedTaskId(null);
    localStorage.setItem("tasks", JSON.stringify(tasks()));
  };

  const handleDrop = (e: DragEvent, targetTaskId: string) => {
    e.preventDefault();

    const sourceTaskId = draggedTaskId();
    if (!sourceTaskId || sourceTaskId === targetTaskId) return;

    try {
      const currentTasks = tasks();
      const sourceIndex = currentTasks.findIndex((t) => t.id === sourceTaskId);
      const targetIndex = currentTasks.findIndex((t) => t.id === targetTaskId);

      if (sourceIndex === -1 || targetIndex === -1) return;

      const newTasks = [...currentTasks];
      const [movedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(targetIndex, 0, movedTask);

      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Error reordering tasks:", error);
    }
  };

  const addTask = () => {
    if (!taskInputValue().trim()) return;

    try {
      const newTask = {
        completed: false,
        title: taskInputValue(),
        id: crypto.randomUUID(),
      };

      const newTasks = [...tasks(), newTask];
      setTasks(newTasks);
      setTaskInputValue("");
      localStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div id="todo-widget">
      <div class="text-foreground flex h-full w-full flex-col">
        <div class="flex-1 overflow-auto p-2">
          <span class="text-sm font-semibold">
            {chrome.i18n.getMessage("tasks")}
          </span>
          <div class="scrollbar-track-transparent max-h-16 overflow-auto">
            {tasks()
              .filter((task: Task) => !task.completed)
              .map((task: Task, index: number) => (
                <div
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, task.id)}
                  class="task hover:bg-accent/20 flex cursor-move items-center gap-2 rounded p-1
                    transition-colors"
                  ondblclick={(e) => {
                    (e.target as HTMLLabelElement).contentEditable = "true";
                    (e.target as HTMLLabelElement).focus();
                  }}
                >
                  <Checkbox
                    id={task.id}
                    onChange={(checked: boolean) => {
                      try {
                        setTasks(
                          tasks()
                            .map((t: Task) =>
                              t.id === task.id
                                ? { ...t, completed: checked }
                                : t
                            )
                            .filter((t: Task) => !t.completed)
                        );
                        localStorage.setItem("tasks", JSON.stringify(tasks()));
                      } catch (error) {
                        console.error("Error updating task:", error);
                      }
                    }}
                  >
                    <CheckboxControl class="!border-white !outline-none focus:ring-2 focus:ring-offset-2" />
                  </Checkbox>
                  <label
                    for={task.id}
                    class="select-none text-xs"
                    onkeydown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") {
                        (e.target as HTMLLabelElement).blur();
                        (e.target as HTMLLabelElement).contentEditable =
                          "false";
                        const currentTasks: Task[] = tasks();
                        currentTasks.find(
                          (t: Task) => t.id === task.id
                        )!.title = (e.target as HTMLLabelElement).innerText;
                        setTasks(currentTasks);
                        localStorage.setItem(
                          "tasks",
                          JSON.stringify(currentTasks)
                        );
                      }
                    }}
                  >
                    {task.title}
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div class="pl-1">
          <TextFieldRoot class="flex-1">
            <TextField
              placeholder={chrome.i18n.getMessage("new_task")}
              value={taskInputValue()}
              onInput={(e: InputEvent) =>
                setTaskInputValue((e.currentTarget as HTMLInputElement)?.value)
              }
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
              class="text-xs !outline-white placeholder:text-white"
            />
          </TextFieldRoot>
        </div>
      </div>
    </div>
  );
}

export { TodoPopover };
