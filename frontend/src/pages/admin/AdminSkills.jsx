import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Zap } from "lucide-react";
import { useCrud } from "../../hooks/useCrud";
import { adminApi } from "../../utils/api";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

const api = {
  getAll: adminApi.getSkills,
  create: adminApi.createSkill,
  update: (id, data) => adminApi.updateSkill(id, data),
  remove: adminApi.deleteSkill,
};

const CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Design",
  "Mobile",
  "Database",
  "Other",
];

function SkillForm({ item, onSubmit, onCancel, loading }) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      name: item?.name ?? "",
      category: item?.category ?? "Frontend",
      proficiency: item?.proficiency ?? 80,
      color: item?.color ?? "#7c6af7",
      order: item?.order ?? 0,
      is_visible: item?.is_visible ?? true,
    },
  });
  const proficiency = watch("proficiency");

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "480px" }}
      >
        <div className="modal-header">
          <h2>{item ? "Edit Skill" : "New Skill"}</h2>
          <button onClick={onCancel} className="btn btn-ghost btn-icon">
            ✕
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) =>
            onSubmit({
              ...d,
              proficiency: parseInt(d.proficiency),
              order: parseInt(d.order),
            }),
          )}
        >
          <div className="modal-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input
                  className="form-input"
                  placeholder="React, Laravel…"
                  {...register("name", { required: true })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  {...register("category", { required: true })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Proficiency — <strong>{proficiency}%</strong>
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="range"
                  min="1"
                  max="100"
                  {...register("proficiency")}
                  style={{ flex: 1, accentColor: "var(--accent)" }}
                />
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  max="100"
                  {...register("proficiency")}
                  style={{ width: "72px", flexShrink: 0 }}
                />
              </div>
              {/* Preview bar */}
              <div
                style={{
                  height: "6px",
                  background: "var(--bg-3)",
                  borderRadius: "100px",
                  marginTop: "0.4rem",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${proficiency}%`,
                    background: "var(--accent)",
                    borderRadius: "100px",
                    transition: "width 0.15s",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">Colour</label>
                <input
                  className="form-input"
                  type="color"
                  {...register("color")}
                  style={{
                    height: "42px",
                    padding: "4px 6px",
                    cursor: "pointer",
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Order</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  {...register("order")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visible</label>
                <select className="form-select" {...register("is_visible")}>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Saving…" : item ? "Update" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSkills() {
  const {
    items,
    isLoading,
    editing,
    setEditing,
    creating,
    setCreating,
    deleting,
    setDeleting,
    create,
    update,
    remove,
    creating_loading,
    updating_loading,
    deleting_loading,
  } = useCrud("admin-skills", api);

  const grouped = items.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Skills</h1>
          <p style={{ color: "var(--text-3)", fontSize: "0.82rem" }}>
            {items.length} skills across {Object.keys(grouped).length}{" "}
            categories
          </p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setCreating(true)}
        >
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: "220px", borderRadius: "16px" }}
            />
          ))}
        </div>
      ) : (
        <div
          className="animate-fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category} className="card" style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {category}
                </h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>
                  {skills.length} skills
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: skill.color || "var(--accent)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.84rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {skill.name}
                        </span>
                        <span
                          style={{
                            color: "var(--text-3)",
                            flexShrink: 0,
                            marginLeft: "0.5rem",
                          }}
                        >
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: "3px",
                          background: "var(--bg-3)",
                          borderRadius: "100px",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${skill.proficiency}%`,
                            background: skill.color || "var(--accent)",
                            borderRadius: "100px",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", gap: "0.15rem", flexShrink: 0 }}
                    >
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => setEditing(skill)}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ color: "var(--red)" }}
                        onClick={() => setDeleting(skill.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1/-1" }}>
              <Zap size={28} />
              <h3>No skills yet</h3>
              <p>Add your first skill to showcase your tech stack.</p>
            </div>
          )}
        </div>
      )}

      {creating && (
        <SkillForm
          onSubmit={create}
          onCancel={() => setCreating(false)}
          loading={creating_loading}
        />
      )}
      {editing && (
        <SkillForm
          item={editing}
          onSubmit={(d) => update({ id: editing.id, data: d })}
          onCancel={() => setEditing(null)}
          loading={updating_loading}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Delete Skill"
        message="Delete this skill permanently?"
        confirmLabel="Delete"
        onConfirm={() => remove(deleting)}
        onCancel={() => setDeleting(null)}
        loading={deleting_loading}
      />
    </div>
  );
}
