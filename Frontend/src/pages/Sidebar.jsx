import React from "react";

const Sidebar = ({
  groupedItems = {},
  selectedChatId = null,
  onItemSelect,
  onNewChat,
  loading = false,
}) => {
  const isEmpty =
    !loading && Object.keys(groupedItems).length === 0;

  return (
    <aside className="sidebar">
      {/* New Chat Button */}
      <button
        className="btn new-chat"
        onClick={onNewChat}
      >
        + New Chat
      </button>

      {/* Loading State */}
      {loading && (
        <p className="sidebar-status">Loading...</p>
      )}

      {/* Empty State */}
      {isEmpty && (
        <p className="sidebar-status">
          No chats found
        </p>
      )}

      {/* Grouped Chats */}
      {!loading &&
        Object.entries(groupedItems).map(
          ([group, chats]) => (
            <div key={group} className="sidebar-section">
              <h4 className="sidebar-group">
                {group}
              </h4>

              {chats.map((chat) => (
                <div
                  key={chat.chat_id}
                  className={`sidebar-item ${
                    chat.chat_id === selectedChatId
                      ? "active"
                      : ""
                  }`}
                  onClick={() => onItemSelect(chat)}
                  title={chat.title || "Untitled chat"}
                >
                  {chat.title || "Untitled chat"}
                </div>
              ))}
            </div>
          )
        )}
    </aside>
  );
};

export default Sidebar;
