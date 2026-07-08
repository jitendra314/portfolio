import { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { adminApi } from '../../utils/api'
import toast from 'react-hot-toast'

/**
 * Image upload widget with drag-and-drop + preview.
 * Props: value (current URL), onChange (url => void), folder
 */
export default function ImageUpload({ value, onChange, folder = 'uploads', label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging]   = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Only image files are accepted'); return }
    if (file.size > 10 * 1024 * 1024)   { toast.error('Max file size is 10 MB'); return }

    setUploading(true)
    try {
      const { data } = await adminApi.uploadFile(file, folder)
      onChange(data.url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
          <img src={value} alt="preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
          <button type="button" onClick={() => onChange('')} className="btn btn-ghost btn-icon btn-sm"
            style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          className={`upload-zone ${dragging ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <span className="spinner" />
              <span style={{ fontSize: '0.82rem' }}>Uploading…</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Image size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Drop image here or click to browse</span>
              <span style={{ fontSize: '0.75rem' }}>JPG, PNG, WebP · max 10 MB</span>
            </div>
          )}
        </div>
      )}

      {/* URL fallback input */}
      <input className="form-input" placeholder="…or paste an image URL" value={value || ''} onChange={e => onChange(e.target.value)} style={{ marginTop: '0.4rem' }} />

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => upload(e.target.files[0])} />
    </div>
  )
}
