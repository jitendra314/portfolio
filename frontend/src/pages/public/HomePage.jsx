import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Github,
  ExternalLink,
  Star,
  MapPin,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { publicApi } from "../../utils/api";

// ── Hero Section ──────────────────────────────────────────
function Hero({ about }) {
  const stats = [
    { label: "Years exp.", value: about?.years_experience ?? 5 },
    { label: "Projects", value: about?.projects_completed ?? 40 },
    { label: "Happy clients", value: about?.clients_served ?? 18 },
  ];

  return (
    <section
      style={{
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(124,106,247,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        {about?.open_to_work && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.9rem",
              borderRadius: "100px",
              background: "rgba(82,232,160,0.1)",
              border: "1px solid rgba(82,232,160,0.25)",
              color: "var(--green)",
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--green)",
                animation: "pulse 2s infinite",
              }}
            />
            Open to opportunities
          </div>
        )}

        <h1
          style={{
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: "1.5rem",
            maxWidth: "14ch",
          }}
        >
          {about?.name ?? "Jitendra Jaiswar"}
          <br />
          <span style={{ color: "var(--text-3)" }}>
            {about?.title ?? "Full Stack Developer"}
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-2)",
            maxWidth: "540px",
            marginBottom: "2.5rem",
            lineHeight: 1.75,
          }}
        >
          {about?.bio ??
            "I build fast, accessible, and visually compelling web applications across the full stack."}
        </p>

        {about?.location && (
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-3)",
              fontSize: "0.85rem",
              marginBottom: "2rem",
            }}
          >
            <MapPin size={14} /> {about.location}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "4rem",
          }}
        >
          <Link
            to="/projects"
            className="btn btn-primary"
            style={{ fontSize: "0.95rem", padding: "0.8rem 1.8rem" }}
          >
            View My Work <ArrowRight size={16} />
          </Link>
          <Link
            to="/contact"
            className="btn btn-outline"
            style={{ fontSize: "0.95rem", padding: "0.8rem 1.8rem" }}
          >
            Get In Touch
          </Link>
        </div>

        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          {stats.map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  color: "var(--text)",
                }}
              >
                {value}+
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-3)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }`}</style>
    </section>
  );
}

// ── Project Card ──────────────────────────────────────────
function ProjectCard({ project }) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.25s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-4px)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: "200px",
          background: `linear-gradient(135deg, var(--surface-2) 0%, var(--bg-3) 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "3rem", opacity: 0.3 }}>⬡</span>
        )}
        {project.is_featured && (
          <div
            style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}
          >
            <span className="badge purple">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          </div>
        )}
        {project.category && (
          <div
            style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}
          >
            <span className="tag">{project.category}</span>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "0.75rem",
        }}
      >
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
          {project.title}
        </h3>
        <p
          style={{
            color: "var(--text-2)",
            fontSize: "0.88rem",
            lineHeight: 1.65,
            flex: 1,
          }}
        >
          {project.description}
        </p>

        {project.tech_stack?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {project.tech_stack.slice(0, 4).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.72rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  background: "var(--bg-3)",
                  color: "var(--text-3)",
                  border: "1px solid var(--border)",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            paddingTop: "0.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link
            to={`/projects/${project.slug}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Details <ArrowRight size={13} />
          </Link>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-icon btn-sm"
            >
              <Github size={15} />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost btn-icon btn-sm"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skill Bar ─────────────────────────────────────────────
function SkillBar({ name, proficiency, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.82rem",
        }}
      >
        <span style={{ fontWeight: 600 }}>{name}</span>
        <span style={{ color: "var(--text-3)" }}>{proficiency}%</span>
      </div>
      <div
        style={{
          height: "5px",
          background: "var(--bg-3)",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${proficiency}%`,
            background: color || "var(--accent)",
            borderRadius: "100px",
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Main HomePage ─────────────────────────────────────────
export default function HomePage() {
  const { data: aboutData } = useQuery({
    queryKey: ["about"],
    queryFn: () => publicApi.getAbout(),
  });
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => publicApi.getProjects(),
  });
  const { data: skillsData } = useQuery({
    queryKey: ["skills"],
    queryFn: () => publicApi.getSkills(),
  });
  const { data: testimonialsData } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => publicApi.getTestimonials(),
  });

  const about = aboutData?.data?.data;
  const projects = projectsData?.data?.data ?? [];
  const skills = skillsData?.data?.data ?? {};
  const testimonials = testimonialsData?.data?.data ?? [];

  const featured = projects.filter((p) => p.is_featured).slice(0, 3);
  const topSkills = Object.values(skills).flat().slice(0, 8);

  return (
    <div>
      <Hero about={about} />

      {/* ── Featured Projects ── */}
      {featured.length > 0 && (
        <section className="section" style={{ background: "var(--bg-2)" }}>
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "3rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div className="tag" style={{ marginBottom: "0.75rem" }}>
                  Selected Work
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 800,
                  }}
                >
                  Featured Projects
                </h2>
              </div>
              <Link to="/projects" className="btn btn-outline">
                All Projects <ArrowRight size={15} />
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {featured.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Skills Preview ── */}
      {topSkills.length > 0 && (
        <section className="section">
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5rem",
                alignItems: "center",
              }}
            >
              <div>
                <div className="tag" style={{ marginBottom: "0.75rem" }}>
                  What I work with
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    fontWeight: 800,
                    marginBottom: "1rem",
                  }}
                >
                  Skills & Technologies
                </h2>
                <p
                  style={{
                    color: "var(--text-2)",
                    lineHeight: 1.75,
                    marginBottom: "1.5rem",
                  }}
                >
                  I love picking up new tools. Here's a snapshot of my current
                  stack — from pixel-perfect UIs to scalable backend services.
                </p>
                <Link to="/about" className="btn btn-outline">
                  View Full Stack <ArrowRight size={15} />
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {topSkills.map((s) => (
                  <SkillBar
                    key={s.id}
                    name={s.name}
                    proficiency={s.proficiency}
                    color={s.color}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="section" style={{ background: "var(--bg-2)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div className="tag" style={{ marginBottom: "0.75rem" }}>
                Kind words
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                }}
              >
                Testimonials
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="card" style={{ padding: "1.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.25rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="var(--amber)"
                        color="var(--amber)"
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      color: "var(--text-2)",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                      marginBottom: "1.25rem",
                      fontStyle: "italic",
                    }}
                  >
                    "{t.content}"
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "var(--surface-2)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--accent-2)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                        {t.name}
                      </div>
                      <div
                        style={{ fontSize: "0.78rem", color: "var(--text-3)" }}
                      >
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: "6rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <Zap
              size={32}
              color="var(--accent)"
              style={{ margin: "0 auto 1.5rem" }}
            />
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              Let's build something great together
            </h2>
            <p style={{ color: "var(--text-2)", marginBottom: "2rem" }}>
              Have a project in mind? I'm available for freelance work and
              full-time roles.
            </p>
            <Link
              to="/contact"
              className="btn btn-primary"
              style={{ fontSize: "1rem", padding: "0.9rem 2.2rem" }}
            >
              Start a Conversation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
