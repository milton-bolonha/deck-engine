import React, { useState, useRef } from "react";

const FeedView = ({
  contentType,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onLike,
  onComment,
  isDevMode = false,
}) => {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const fileInputRef = useRef(null);

  // Criar novo post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      content: newPostContent,
      image: selectedImage,
      author: "Usuário Atual",
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      liked: false,
    };

    onAdd && onAdd(newPost);
    setNewPostContent("");
    setSelectedImage(null);
    setShowNewPost(false);
  };

  // Upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Like/Unlike post
  const handleLike = (post) => {
    const updatedPost = {
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
    };
    onLike && onLike(updatedPost);
  };

  // Adicionar comentário
  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText?.trim()) return;

    const post = data.find((p) => p.id === postId);
    if (!post) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
      author: "Usuário Atual",
      timestamp: new Date().toISOString(),
    };

    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), newComment],
    };

    onComment && onComment(updatedPost);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  // Formatação de tempo
  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now - postTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return postTime.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {contentType?.name || "Feed"}
          </h2>
          <p className="text-gray-600 mt-1">
            {contentType?.description || "Feed social"}
          </p>
        </div>

        {isDevMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              🚧 <strong>DevMode:</strong> Feed View • Posts Sociais
            </p>
          </div>
        )}
      </div>

      {/* New Post */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        {!showNewPost ? (
          <button
            onClick={() => setShowNewPost(true)}
            className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            No que você está pensando?
          </button>
        ) : (
          <div className="space-y-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="No que você está pensando?"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />

            {selectedImage && (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-70"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="fas fa-image"></i>
                  Foto
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowNewPost(false);
                    setNewPostContent("");
                    setSelectedImage(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-comments text-4xl mb-4"></i>
            <p className="text-lg font-medium mb-2">Nenhum post ainda</p>
            <p className="text-sm">Seja o primeiro a compartilhar algo!</p>
          </div>
        ) : (
          data.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-gray-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{post.author}</h4>
                    <p className="text-sm text-gray-500">
                      {formatTime(post.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit && onEdit(post)}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                    title="Editar"
                  >
                    <i className="fas fa-edit text-sm"></i>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(post.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    title="Excluir"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="border-t border-gray-200">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="border-t border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-2 transition-colors ${
                        post.liked
                          ? "text-red-600"
                          : "text-gray-600 hover:text-red-600"
                      }`}
                    >
                      <i
                        className={`${post.liked ? "fas" : "far"} fa-heart`}
                      ></i>
                      <span className="text-sm">{post.likes}</span>
                    </button>

                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <i className="far fa-comment"></i>
                      <span className="text-sm">
                        {post.comments?.length || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-gray-600 text-xs"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-gray-600 text-xs"></i>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Escreva um comentário..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment(post.id)
                      }
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="fas fa-paper-plane text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedView;
