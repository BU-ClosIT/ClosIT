import { FirebaseServices } from "@/src/services/firebase-services";
import { useState } from "react";
import { useUser } from "../providers/UserProvider";
import { useWeather } from "../providers/WeatherProvider";

export default function AiChatCard() {
  const user = useUser();
  const { weather: currentWeather, loading } = useWeather();
  const [context, setContext] = useState<
    Array<{ role: string; content: string; timestamp?: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoadingResp, setIsLoadingResp] = useState(false);

  const scrollChatToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const handleMessage = async () => {
    if (input.trim() === "") return;

    const newContext = [
      ...context,
      {
        role: "user",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      },
    ];
    setContext(newContext);
    setInput("");
    scrollChatToBottom();

    if (!user) {
      setContext((prevContext) => [
        ...prevContext,
        {
          role: "ai",
          content: "Please log in to chat with the AI assistant.",
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    try {
      // Call AI service here with newContext
      setIsLoadingResp(true);
      const resp = await FirebaseServices.converse({
        query: {
          context: newContext,
          currentWeather:
            currentWeather?.currentConditions || "No weather data available",
        },
        userId: user?.id,
      });
      setIsLoadingResp(false);
      setContext((prevContext) => [
        ...prevContext,
        {
          role: "ai",
          content: JSON.stringify(resp),
          timestamp: new Date().toISOString(),
        },
      ]);

      scrollChatToBottom();
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setContext((prevContext) => [
        ...prevContext,
        {
          role: "ai",
          content: "Error fetching AI response.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    scrollChatToBottom();
  };

  return (
    <div className="w-full h-120 p-4 bg-white rounded-lg shadow-md overflow-y-auto flex flex-col space-y-4 items-center justify-between">
      <div className="w-full text-center mb-4">
        <p className="text-gray-600">
          Chat with our AI assistant to get fashion advice and outfit
          suggestions!
        </p>

        {context.length === 0 ? (
          <p className="italic text-gray-400 mt-4">
            Start the conversation by typing a message below.
          </p>
        ) : (
          <div
            className="w-full max-h-72 overflow-y-auto p-2 rounded"
            id="chat-container"
          >
            {context.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  msg.role === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp || "").toLocaleTimeString()}
                </p>
              </div>
            ))}

            {isLoadingResp && (
              <div className="mb-2 p-2 rounded bg-gray-200 self-start text-left">
                <p className="text-sm italic text-gray-600">AI is typing...</p>
                <div className="h-2 bg-gray-300 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border p-2 w-full shadow-md rounded  overflow-y-auto flex flex-row">
        <input
          type="text"
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-2 outline-none rounded"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleMessage();
          }}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
