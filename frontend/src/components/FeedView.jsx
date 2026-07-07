import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Image, Loader2, Send, SmilePlus, X } from "lucide-react";
import { apiRequest } from "../api.js";
import { reactionOptions } from "../config/reactions.js";
import { addReaction, renderReactionSummary, userReaction } from "../utils/reactions.js";
import { formatDate } from "../utils/format.js";

export function FeedView({ user }) {
  const [posts, setPosts] = useState([]);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [postDraft, setPostDraft] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);
  const userId = user.id || user._id;

  async function loadFeed() {
    setLoading(true);
    setMessage(null);
    try {
      const postsResponse = await apiRequest("/publicaciones_feed?limit=30&sort=-createdAt");
      const loadedPosts = postsResponse.data || [];
      setPosts(loadedPosts);
      const commentEntries = await Promise.all(
        loadedPosts.map(async (post) => {
          const response = await apiRequest(`/comentarios?publicacion_id=${encodeURIComponent(post._id)}&limit=100&sort=createdAt`);
          return [post._id, response.data || []];
        })
      );
      setCommentsByPost(Object.fromEntries(commentEntries));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function createPost(event) {
    event.preventDefault();
    const content = postDraft.trim();
    if (!content && !selectedImage) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiRequest("/publicaciones_feed", {
        method: "POST",
        body: JSON.stringify({
          autor_id: userId,
          tipo_publicacion: "comunicado",
          contenido: content,
          multimedia: selectedImage ? [selectedImage] : [],
          reacciones: [],
          estado: "publicado",
        }),
      });
      setPostDraft("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadFeed();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  function selectImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Solo puedes subir imagenes." });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({
        tipo: "imagen",
        nombre: file.name,
        url: reader.result,
        size_mb: Number((file.size / 1024 / 1024).toFixed(2)),
      });
    };
    reader.readAsDataURL(file);
  }

  function removeSelectedImage() {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function createComment(postId) {
    const content = (commentDrafts[postId] || "").trim();
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiRequest("/comentarios", {
        method: "POST",
        body: JSON.stringify({
          publicacion_id: postId,
          autor_id: userId,
          texto: content,
          reacciones: [],
        }),
      });
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      await loadFeed();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function reactToPost(post, emoji) {
    const reacciones = addReaction(post.reacciones, emoji, userId);
    setPosts((current) => current.map((item) => item._id === post._id ? { ...item, reacciones } : item));
    try {
      await apiRequest(`/publicaciones_feed/${post._id}`, { method: "PATCH", body: JSON.stringify({ reacciones }) });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      await loadFeed();
    }
  }

  async function reactToComment(postId, comment, emoji) {
    const reacciones = addReaction(comment.reacciones, emoji, userId);
    setCommentsByPost((current) => ({
      ...current,
      [postId]: (current[postId] || []).map((item) => item._id === comment._id ? { ...item, reacciones } : item),
    }));
    try {
      await apiRequest(`/comentarios/${comment._id}`, { method: "PATCH", body: JSON.stringify({ reacciones }) });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
      await loadFeed();
    }
  }

  function authorLabel(authorId) {
    return String(authorId) === String(userId) ? user.nombre : "Equipo Translogix";
  }

  function isMine(authorId) {
    return String(authorId) === String(userId);
  }

  async function deleteComment(postId, comment) {
    if (!isMine(comment.autor_id)) return;
    if (!window.confirm("Eliminar tu comentario?")) return;
    setSaving(true);
    try {
      await apiRequest(`/comentarios/${comment._id}`, { method: "DELETE" });
      setCommentsByPost((current) => ({
        ...current,
        [postId]: (current[postId] || []).filter((item) => item._id !== comment._id),
      }));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="feedPage">
      <form className="composer" onSubmit={createPost}>
        <div className="avatar">{user.nombre?.slice(0, 1) || "T"}</div>
        <label className="composerBox">
          <span>Publicar en el feed operativo</span>
          <textarea value={postDraft} onChange={(event) => setPostDraft(event.target.value)} placeholder="Comparte una novedad, incidencia, evidencia o comunicado..." rows={3} />
        </label>
        {selectedImage && (
          <div className="imagePreview">
            <img alt={selectedImage.nombre || "Imagen seleccionada"} src={selectedImage.url} />
            <div>
              <strong>{selectedImage.nombre}</strong>
              <span>{selectedImage.size_mb} MB</span>
            </div>
            <button className="iconButton" onClick={removeSelectedImage} type="button" title="Quitar imagen"><X size={16} /></button>
          </div>
        )}
        <div className="composerActions">
          <input accept="image/*" className="fileInput" onChange={selectImage} ref={fileInputRef} type="file" />
          <button className="secondaryButton" onClick={() => fileInputRef.current?.click()} type="button"><Image size={18} />Imagen</button>
          <button className="primaryButton" disabled={saving || (!postDraft.trim() && !selectedImage)} type="submit">{saving ? <Loader2 className="spin" size={18} /> : <Send size={18} />}Publicar</button>
        </div>
      </form>

      {message && <div className={`notice ${message.type}`}>{message.type === "success" ? <CheckCircle2 size={18} /> : <X size={18} />}<span>{message.text}</span></div>}
      {loading && <div className="feedLoading"><Loader2 className="spin" size={18} />Cargando feed...</div>}

      <div className="feedList">
        {posts.map((post) => (
          <article className="postCard" key={post._id}>
            <header className="postHeader">
              <div className="avatar small">{authorLabel(post.autor_id).slice(0, 1)}</div>
              <div>
                <strong>{authorLabel(post.autor_id)}</strong>
                <span>{post.tipo_publicacion || "publicacion"} | {formatDate(post.createdAt)}</span>
              </div>
            </header>
            <p className="postContent">{post.contenido}</p>
            {Array.isArray(post.multimedia) && post.multimedia.length > 0 && (
              <div className="mediaGrid">{post.multimedia.map((media, index) => media.tipo === "imagen" ? <img alt={media.nombre || "Imagen del feed"} key={`${media.url}-${index}`} src={media.url} /> : <span key={`${media.url}-${index}`}><Image size={16} />{media.tipo}: {media.url}</span>)}</div>
            )}
            <div className="reactionSummary">{renderReactionSummary(post.reacciones)}</div>
            <div className="reactionBar" aria-label="Reacciones de publicacion">
              {reactionOptions.map((reaction) => <button className={userReaction(post.reacciones, userId) === reaction.emoji ? "active" : ""} key={reaction.emoji} onClick={() => reactToPost(post, reaction.emoji)} title={reaction.label} type="button">{reaction.emoji}</button>)}
            </div>

            <section className="commentsBlock">
              {(commentsByPost[post._id] || []).map((comment) => (
                <div className="commentItem" key={comment._id}>
                  <div className="avatar mini">{authorLabel(comment.autor_id).slice(0, 1)}</div>
                  <div className="commentBubble">
                    <div className="commentHeader"><strong>{authorLabel(comment.autor_id)}</strong>{isMine(comment.autor_id) && <button onClick={() => deleteComment(post._id, comment)} type="button">Eliminar</button>}</div>
                    <p>{comment.texto}</p>
                    <div className="commentMeta"><span>{formatDate(comment.createdAt)}</span><span>{renderReactionSummary(comment.reacciones)}</span></div>
                    <div className="miniReactionBar" aria-label="Reacciones de comentario">
                      {reactionOptions.slice(0, 4).map((reaction) => <button className={userReaction(comment.reacciones, userId) === reaction.emoji ? "active" : ""} key={reaction.emoji} onClick={() => reactToComment(post._id, comment, reaction.emoji)} title={reaction.label} type="button">{reaction.emoji}</button>)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="commentComposer">
                <div className="avatar mini">{user.nombre?.slice(0, 1) || "T"}</div>
                <input value={commentDrafts[post._id] || ""} onChange={(event) => setCommentDrafts((current) => ({ ...current, [post._id]: event.target.value }))} onKeyDown={(event) => { if (event.key === "Enter") createComment(post._id); }} placeholder="Escribe un comentario..." />
                <button className="iconButton" onClick={() => createComment(post._id)} disabled={saving || !(commentDrafts[post._id] || "").trim()} type="button" title="Comentar"><Send size={16} /></button>
              </div>
            </section>
          </article>
        ))}
        {!loading && posts.length === 0 && <div className="emptyFeed"><SmilePlus size={22} />Todavia no hay publicaciones.</div>}
      </div>
    </section>
  );
}
