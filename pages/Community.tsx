
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { INITIAL_PROFILE, MOCK_POSTS } from '../constants';
import { Post, PostCategory, Comment } from '../types';
import { validateContent } from '../services/geminiService';
import { 
  MessageSquare, Heart, Share2, MoreHorizontal, Image as ImageIcon, 
  Paperclip, Send, X, ChevronDown, Filter, FileText, Trash2, Archive, Edit2, AlertTriangle, Loader2, Download, Check
} from 'lucide-react';

const PostCategoryBadge = ({ category }: { category: PostCategory }) => {
  const colors: Record<PostCategory, string> = {
    'Academic': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'Non-Academic': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'Event': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'Announcement': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'Social': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${colors[category]}`}>
      {category}
    </span>
  );
};

export const Community = () => {
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  
  // Post Creation States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | ''>('');
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  // Interaction States
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [activeMenuCommentId, setActiveMenuCommentId] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null); 
  const [newCommentContent, setNewCommentContent] = useState(''); 
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Share & Highlight States
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

  // Comment Moderation States
  const [isCommentModerating, setIsCommentModerating] = useState(false);
  const [commentError, setCommentError] = useState<{postId: string, error: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL query params for deep linking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postId = params.get('id');
    if (postId) {
      setHighlightedPostId(postId);
      setTimeout(() => {
        const element = document.getElementById(`post-${postId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setExpandedPostId(postId);
        }
      }, 500);
    }
  }, [location.search]);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() || !selectedCategory) return;
    setModerationError(null);
    setIsModerating(true);

    const validation = await validateContent(newPostContent);
    setIsModerating(false);

    if (!validation.safe) {
      setModerationError(validation.reason || "Your post contains content that violates community guidelines.");
      return;
    }

    let finalImage: string | undefined;
    let finalFile: { name: string; type: string } | undefined;

    if (editingPost) {
       finalImage = editingPost.image;
       finalFile = editingPost.file;
    }

    if (newPostFile) {
        if (newPostFile.type.startsWith('image/')) {
            finalImage = URL.createObjectURL(newPostFile);
            finalFile = undefined;
        } else {
            finalImage = undefined;
            finalFile = { name: newPostFile.name, type: 'file' };
        }
    }

    if (editingPost) {
       setPosts(posts.map(p => p.id === editingPost.id ? {
         ...p,
         content: newPostContent,
         category: selectedCategory,
         image: finalImage,
         file: finalFile
       } : p));
       setEditingPost(null);
    } else {
       const newPost: Post = {
        id: Date.now().toString(),
        author: {
          name: INITIAL_PROFILE.name,
          avatar: INITIAL_PROFILE.avatar,
          role: 'Student'
        },
        category: selectedCategory,
        content: newPostContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        image: finalImage,
        file: finalFile
      };
      setPosts([newPost, ...posts]);
    }

    closeModal();
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!newCommentContent.trim()) return;
    
    setIsCommentModerating(true);
    setCommentError(null);

    const validation = await validateContent(newCommentContent);
    setIsCommentModerating(false);

    if (!validation.safe) {
      setCommentError({
        postId,
        error: validation.reason || "Your comment contains inappropriate content."
      });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: INITIAL_PROFILE.name,
      avatar: INITIAL_PROFILE.avatar,
      content: newCommentContent,
      timestamp: 'Just now'
    };

    setPosts(posts.map(p => {
       if (p.id === postId) {
         return {
           ...p,
           comments: p.comments + 1,
           commentsList: [...(p.commentsList || []), newComment]
         };
       }
       return p;
    }));
    setNewCommentContent('');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId && p.commentsList) {
        return {
          ...p,
          comments: Math.max(0, p.comments - 1),
          commentsList: p.commentsList.filter(c => c.id !== commentId)
        };
      }
      return p;
    }));
    setActiveMenuCommentId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setNewPostContent('');
    setSelectedCategory('');
    setNewPostFile(null);
    setModerationError(null);
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setNewPostContent(post.content);
    setSelectedCategory(post.category);
    setIsModalOpen(true);
    setActiveMenuPostId(null);
  };

  const handleDeleteClick = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    setActiveMenuPostId(null);
  };

  const handleArchiveClick = (postId: string) => {
     setPosts(posts.map(p => p.id === postId ? { ...p, isArchived: !p.isArchived } : p));
     setActiveMenuPostId(null);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => {
       if (p.id === postId) {
         return {
           ...p,
           isLiked: !p.isLiked,
           likes: p.isLiked ? p.likes - 1 : p.likes + 1
         };
       }
       return p;
    }));
  };

  const toggleComments = (postId: string) => {
    if (expandedPostId !== postId) {
      setNewCommentContent('');
      setCommentError(null);
      setActiveMenuCommentId(null);
    }
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleShareClick = (postId: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const shareUrl = `${origin}${pathname}#/community?id=${postId}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareSuccessId(postId);
      setTimeout(() => setShareSuccessId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy link', err);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPostFile(e.target.files[0]);
    }
  };

  const visiblePosts = posts.filter(p => !p.isArchived);

  return (
    <div className="animate-fade-in pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Chat Box</h1>
          <p className="text-gray-500 mt-2">Connect, ask, and share with your course community</p>
        </div>
      </div>

      {/* Post Trigger */}
      <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-gray-800 mb-8 flex items-center gap-4 transition-all hover:shadow-lg">
        <img src={INITIAL_PROFILE.avatar} alt="User" className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-gray-50 dark:bg-gray-800 text-left px-6 py-4 rounded-2xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
        >
          What's on your mind? Post a question or update...
        </button>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all hover:scale-105"
        >
          <Send size={20} />
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {visiblePosts.map((post) => (
          <div 
            key={post.id} 
            id={`post-${post.id}`}
            className={`bg-white dark:bg-dark-card rounded-3xl p-6 shadow-soft border transition-all duration-500 animate-slide-up relative ${
              highlightedPostId === post.id 
                ? 'border-primary ring-2 ring-primary/20 shadow-lg shadow-indigo-500/10' 
                : 'border-gray-100 dark:border-gray-800'
            }`}
          >
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{post.author.name}</h3>
                    {post.author.role && (
                      <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded font-medium">{post.author.role}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <PostCategoryBadge category={post.category} />
                 
                 {post.author.name === INITIAL_PROFILE.name && (
                   <div className="relative">
                     <button 
                       onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                       className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                     >
                       <MoreHorizontal size={20} />
                     </button>
                     {activeMenuPostId === post.id && (
                       <div className="absolute right-0 top-8 w-40 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-10 overflow-hidden animate-fade-in">
                          <button onClick={() => handleEditClick(post)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                             <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => handleArchiveClick(post.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                             <Archive size={14} /> Archive
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                          <button onClick={() => handleDeleteClick(post.id)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600">
                             <Trash2 size={14} /> Delete
                          </button>
                       </div>
                     )}
                   </div>
                 )}
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Attachments */}
            {post.image && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative group">
                <img src={post.image} alt="Post attachment" className="w-full h-auto max-h-96 object-cover" />
                 <a 
                  href={post.image} 
                  download={`image-${post.id}`}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-md"
                  title="Download Image"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <Download size={18} />
                </a>
              </div>
            )}

            {post.file && (
              <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-primary shadow-sm">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{post.file.name}</p>
                  <p className="text-xs text-gray-400 uppercase">{post.file.type}</p>
                </div>
                <button className="text-xs font-bold text-primary hover:underline px-2">Download</button>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors group ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                >
                  <Heart size={18} className={post.isLiked ? 'fill-current' : 'group-hover:fill-current'} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${expandedPostId === post.id ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                >
                  <MessageSquare size={18} />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
              </div>
              <button 
                onClick={() => handleShareClick(post.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative group"
                title="Share Post"
              >
                {shareSuccessId === post.id ? (
                    <div className="flex items-center text-green-500 animate-fade-in">
                        <span className="text-xs font-bold mr-1">Copied!</span>
                        <Check size={18} />
                    </div>
                ) : (
                    <Share2 size={18} />
                )}
              </button>
            </div>

            {/* Comments Section */}
            {expandedPostId === post.id && (
               <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 animate-fade-in">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Replies</h4>
                  
                  {post.commentsList && post.commentsList.length > 0 ? (
                    <div className="space-y-4 mb-4">
                      {post.commentsList.map(comment => (
                        <div key={comment.id} className="flex gap-3 group">
                           <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover" />
                           <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-none p-3 flex-1 relative">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{comment.author}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                                  {comment.author === INITIAL_PROFILE.name && (
                                     <div className="relative">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id);
                                          }}
                                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                                        >
                                          <MoreHorizontal size={14} />
                                        </button>
                                        {activeMenuCommentId === comment.id && (
                                          <div className="absolute right-0 top-5 w-24 bg-white dark:bg-dark-card rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden animate-fade-in">
                                             <button 
                                               onClick={() => handleDeleteComment(post.id, comment.id)}
                                               className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1.5 text-red-600"
                                             >
                                                <Trash2 size={12} /> Delete
                                             </button>
                                          </div>
                                        )}
                                     </div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                              <button 
                                onClick={() => {
                                  const input = document.getElementById(`comment-input-${post.id}`);
                                  if(input) input.focus();
                                }}
                                className="text-[10px] font-bold text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                              >
                                Reply
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic mb-4">No replies yet. Be the first!</p>
                  )}

                  {commentError?.postId === post.id && (
                    <div className="mb-3 px-2 flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-xs font-medium">
                        <AlertTriangle size={14} />
                        <span>{commentError.error}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                     <img src={INITIAL_PROFILE.avatar} className="w-8 h-8 rounded-full object-cover" alt="Me" />
                     <div className="flex-1 relative">
                        <input 
                           id={`comment-input-${post.id}`}
                           type="text" 
                           placeholder="Write a reply..." 
                           value={newCommentContent}
                           onChange={(e) => setNewCommentContent(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && !isCommentModerating && handleCommentSubmit(post.id)}
                           disabled={isCommentModerating}
                           className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-gray-800 dark:text-white disabled:opacity-60" 
                        />
                        <button 
                          onClick={() => handleCommentSubmit(post.id)}
                          disabled={!newCommentContent.trim() || isCommentModerating}
                          className="absolute right-2 top-2 text-primary hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {isCommentModerating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        </button>
                     </div>
                  </div>
               </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-card rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-scale-in flex flex-col">
             
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingPost ? 'Edit Post' : 'Create Post'}</h2>
               <button onClick={closeModal} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                 <X size={20} />
               </button>
             </div>

             {moderationError && (
               <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-start gap-3">
                 <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                 <div>
                   <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Content Warning</h4>
                   <p className="text-xs text-red-600 dark:text-red-300 mt-1">{moderationError}</p>
                 </div>
               </div>
             )}

             <div className="mb-4">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Category</label>
                <div className="relative">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as PostCategory)}
                    className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select a topic...</option>
                    <option value="Academic">Academic / Question</option>
                    <option value="Non-Academic">Non-Academic / General</option>
                    <option value="Event">Event</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Social">Social</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
             </div>

             {selectedCategory && (
               <div className="animate-fade-in">
                 <textarea 
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   placeholder={`What's on your mind regarding ${selectedCategory}?`}
                   rows={6}
                   className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 outline-none resize-none transition-all mb-4"
                 />

                 <div className="flex items-center gap-2 mb-6">
                   <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold transition-colors"
                   >
                     <Paperclip size={16} /> Attach File
                   </button>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     onChange={handleFileSelect}
                   />
                   {newPostFile && (
                     <span className="text-xs text-primary font-medium flex items-center bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800">
                       {newPostFile.type.startsWith('image/') ? <ImageIcon size={12} className="mr-1"/> : <FileText size={12} className="mr-1"/>}
                       {newPostFile.name}
                       <button onClick={() => setNewPostFile(null)} className="ml-2 hover:text-red-500"><X size={12}/></button>
                     </span>
                   )}
                 </div>

                 <button 
                   onClick={handlePostSubmit}
                   disabled={!newPostContent.trim() || isModerating}
                   className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg ${
                     newPostContent.trim() && !isModerating
                       ? 'bg-primary text-white hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-1' 
                       : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                   }`}
                 >
                   {isModerating ? (
                     <>Checking Content <Loader2 size={18} className="ml-2 animate-spin" /></>
                   ) : (
                     <>{editingPost ? 'Update Post' : 'Post to Community'} <Send size={18} className="ml-2" /></>
                   )}
                 </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
