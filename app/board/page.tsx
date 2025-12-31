'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot 
} from 'firebase/firestore';

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  password?: string; // 비밀번호 추가
  createdAt: string;
  comments?: Comment[];
  views: number;
  category: string;
}

export default function BoardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // 비밀번호 확인 모달 상태
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null); // 수정 중인 게시글
  const [targetPostId, setTargetPostId] = useState<string | null>(null);
  const [authAction, setAuthAction] = useState<'edit' | 'delete' | null>(null);
  const [authPassword, setAuthPassword] = useState('');

  const [newPost, setNewPost] = useState({ title: '', content: '', author: '', password: '', category: '자유' });
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '자유', '안전팁', '질문', '공지'];

  // Firebase Firestore 실시간 연동
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData: Post[] = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() } as Post);
      });
      setPosts(postsData);
      
      // 상세보기 모달이 열려있다면 최신 데이터로 업데이트
      if (selectedPost) {
        const updatedSelectedPost = postsData.find(p => p.id === selectedPost.id);
        if (updatedSelectedPost) setSelectedPost(updatedSelectedPost);
      }
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [selectedPost?.id]);

  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        ...newPost,
        createdAt: new Date().toLocaleString(),
        comments: [],
        views: 0,
      });
      setIsWriteModalOpen(false);
      setNewPost({ title: '', content: '', author: '', password: '', category: '자유' });
    } catch (error) {
      console.error('Error adding post:', error);
      alert('게시글 등록에 실패했습니다.');
    }
  };

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    try {
      const postRef = doc(db, 'posts', post.id);
      await updateDoc(postRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.author || !newComment.content) return;

    const comment: Comment = {
      id: Date.now().toString(),
      ...newComment,
      createdAt: new Date().toLocaleString(),
    };

    try {
      const postRef = doc(db, 'posts', selectedPost.id);
      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });
      setNewComment({ author: '', content: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const commentToDelete = selectedPost?.comments?.find(c => c.id === commentId);
    if (!commentToDelete) return;

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayRemove(commentToDelete)
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetPost = posts.find(p => p.id === targetPostId);
    
    if (targetPost?.password === authPassword) {
      if (authAction === 'delete') {
        try {
          await deleteDoc(doc(db, 'posts', targetPostId!));
          if (selectedPost?.id === targetPostId) setSelectedPost(null);
          alert('삭제되었습니다.');
        } catch (error) {
          alert('삭제 중 오류가 발생했습니다.');
        }
      } else if (authAction === 'edit') {
        setEditingPost(targetPost);
        setIsEditModalOpen(true);
      }
      setIsAuthModalOpen(false);
      setAuthPassword('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const postRef = doc(db, 'posts', editingPost.id);
      await updateDoc(postRef, {
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category
      });
      setIsEditModalOpen(false);
      setEditingPost(null);
      alert('수정되었습니다.');
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const deletePost = (id: string) => {
    setTargetPostId(id);
    setAuthAction('delete');
    setIsAuthModalOpen(true);
  };

  const editPost = (id: string) => {
    setTargetPostId(id);
    setAuthAction('edit');
    setIsAuthModalOpen(true);
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.category === '공지' && b.category !== '공지') return -1;
      if (a.category !== '공지' && b.category === '공지') return 1;

      if (sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'views') return b.views - a.views;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 pb-12 text-gray-900">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            뒤로가기
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">커뮤니티 게시판</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">커뮤니티</h2>
            <p className="text-gray-500 text-sm">자유롭게 의견을 나누고 정보를 공유하세요.</p>
          </div>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            글쓰기
          </button>
        </div>

        {/* 필터 및 검색 바 */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="제목 또는 내용으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="latest">최신순</option>
              <option value="views">조회순</option>
            </select>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              </div>
              <p className="text-gray-400 font-medium text-sm">검색 결과가 없거나 등록된 게시글이 없습니다.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div 
                key={post.id} 
                onClick={() => handlePostClick(post)}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer overflow-hidden active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        post.category === '공지' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 truncate">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                      <span className="font-bold text-gray-600 truncate max-w-[100px]">{post.author}</span>
                      <span className="shrink-0">•</span>
                      <span className="shrink-0">{post.createdAt}</span>
                      <span className="shrink-0">•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {post.views}
                      </span>
                      {post.comments && post.comments.length > 0 && (
                        <span className="text-blue-500 font-bold flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                          {post.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        editPost(post.id);
                      }} 
                      className="text-gray-300 hover:text-blue-500 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(post.id);
                      }} 
                      className="text-gray-300 hover:text-red-500 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2" /></svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed line-clamp-2 break-all text-sm">
                  {post.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 게시글 상세보기 모달 */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  selectedPost.category === '공지' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {selectedPost.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => editPost(selectedPost.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="수정"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button 
                  onClick={() => deletePost(selectedPost.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="삭제"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2" /></svg>
                </button>
                <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 break-all leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs border-y border-gray-50 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[10px]">
                      {selectedPost.author.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-700">{selectedPost.author}</span>
                  </div>
                  <span className="text-gray-200">|</span>
                  <span className="text-gray-400">{selectedPost.createdAt}</span>
                  <span className="text-gray-200">|</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    조회 {selectedPost.views}
                  </span>
                </div>
              </div>
              <div className="text-gray-700 leading-loose text-base md:text-lg whitespace-pre-wrap break-all mb-12">
                {selectedPost.content}
              </div>

              {/* 댓글 섹션 */}
              <div className="border-t border-gray-100 pt-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  댓글 <span className="text-blue-600">{(selectedPost.comments || []).length}</span>
                </h4>
                
                {/* 댓글 작성 폼 */}
                <form onSubmit={handleAddComment} className="bg-gray-50 p-4 rounded-2xl mb-8 space-y-3">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={newComment.author}
                      onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                      className="w-32 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="닉네임"
                    />
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      required
                      value={newComment.content}
                      onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none transition-all"
                      placeholder="따뜻한 댓글을 남겨주세요"
                      rows={2}
                    ></textarea>
                    <button 
                      type="submit"
                      className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-all shrink-0 active:scale-95"
                    >
                      등록
                    </button>
                  </div>
                </form>

                {/* 댓글 목록 */}
                <div className="space-y-6">
                  {(selectedPost.comments || []).length === 0 ? (
                    <p className="text-center text-gray-400 py-4 text-sm">첫 번째 댓글을 남겨보세요!</p>
                  ) : (
                    selectedPost.comments?.map(comment => (
                      <div key={comment.id} className="flex gap-3 animate-in fade-in duration-300">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                          {comment.author.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
                              <span className="text-[10px] text-gray-400">{comment.createdAt}</span>
                            </div>
                            <button 
                              onClick={() => handleDeleteComment(selectedPost.id, comment.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2" /></svg>
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed break-all whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all active:scale-95 shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 글쓰기 모달 */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">새 게시글 작성</h3>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleWriteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c !== '전체' && c !== '공지').map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewPost({ ...newPost, category: cat })}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        newPost.category === cat 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                  작성자
                  <span className="text-[10px] text-gray-400 font-normal">{newPost.author.length}/15</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={newPost.author}
                  onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="닉네임을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                  제목
                  <span className="text-[10px] text-gray-400 font-normal">{newPost.title.length}/30</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="제목을 입력하세요 (최대 30자)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">내용</label>
                <textarea
                  required
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                  placeholder="함께 나누고 싶은 내용을 입력하세요"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                  비밀번호
                  <span className="text-[10px] text-gray-400 font-normal">수정/삭제 시 필요</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPost.password}
                  onChange={(e) => setNewPost({ ...newPost, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
                등록하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 비밀번호 확인 모달 */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">비밀번호 확인</h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="p-6 space-y-4">
              <p className="text-sm text-gray-500 text-center">수정 또는 삭제를 위해<br/>게시글 비밀번호를 입력해주세요.</p>
              <input
                type="password"
                required
                autoFocus
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest"
                placeholder="••••"
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100">
                확인
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 게시글 수정 모달 */}
      {isEditModalOpen && editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">게시글 수정</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c !== '전체' && c !== '공지').map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditingPost({ ...editingPost, category: cat })}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        editingPost.category === cat 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 flex justify-between">
                  제목
                  <span className="text-[10px] text-gray-400 font-normal">{editingPost.title.length}/30</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">내용</label>
                <textarea
                  required
                  rows={8}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
                수정 완료
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
