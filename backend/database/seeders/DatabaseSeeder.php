<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\{User, Project, Skill, Experience, Testimonial, About, Setting, BlogPost};
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name'     => 'Alex Morgan',
            'email'    => 'admin@portfolio.dev',
            'password' => Hash::make('admin123'),
            'is_admin' => true,
        ]);

        // About
        About::create([
            'name'               => 'Alex Morgan',
            'title'              => 'Full Stack Developer & UI Craftsman',
            'bio'                => 'I build fast, accessible, and visually compelling web applications. With 5+ years of experience across the full stack, I love turning complex problems into elegant, user-friendly solutions. Currently open to exciting opportunities.',
            'location'           => 'San Francisco, CA',
            'email'              => 'alex@portfolio.dev',
            'years_experience'   => 5,
            'projects_completed' => 40,
            'clients_served'     => 18,
            'open_to_work'       => true,
            'social_links'       => [
                'github'   => 'https://github.com',
                'linkedin' => 'https://linkedin.com',
                'twitter'  => 'https://twitter.com',
                'dribbble' => 'https://dribbble.com',
            ],
        ]);

        // Skills
        $skills = [
            ['name'=>'React',       'category'=>'Frontend',  'proficiency'=>92, 'color'=>'#61DAFB'],
            ['name'=>'TypeScript',  'category'=>'Frontend',  'proficiency'=>88, 'color'=>'#3178C6'],
            ['name'=>'Vue.js',      'category'=>'Frontend',  'proficiency'=>80, 'color'=>'#4FC08D'],
            ['name'=>'Tailwind CSS','category'=>'Frontend',  'proficiency'=>95, 'color'=>'#38BDF8'],
            ['name'=>'Next.js',     'category'=>'Frontend',  'proficiency'=>85, 'color'=>'#000000'],
            ['name'=>'Laravel',     'category'=>'Backend',   'proficiency'=>90, 'color'=>'#FF2D20'],
            ['name'=>'Node.js',     'category'=>'Backend',   'proficiency'=>82, 'color'=>'#339933'],
            ['name'=>'PostgreSQL',  'category'=>'Backend',   'proficiency'=>78, 'color'=>'#4169E1'],
            ['name'=>'MySQL',       'category'=>'Backend',   'proficiency'=>85, 'color'=>'#4479A1'],
            ['name'=>'Redis',       'category'=>'Backend',   'proficiency'=>72, 'color'=>'#DC382D'],
            ['name'=>'Docker',      'category'=>'DevOps',    'proficiency'=>75, 'color'=>'#2496ED'],
            ['name'=>'AWS',         'category'=>'DevOps',    'proficiency'=>70, 'color'=>'#FF9900'],
            ['name'=>'Git',         'category'=>'DevOps',    'proficiency'=>93, 'color'=>'#F05032'],
            ['name'=>'Figma',       'category'=>'Design',    'proficiency'=>80, 'color'=>'#F24E1E'],
        ];
        foreach ($skills as $i => $skill) {
            Skill::create(array_merge($skill, ['order' => $i, 'is_visible' => true]));
        }

        // Projects
        $projects = [
            ['title'=>'E-Commerce Platform','description'=>'Full-featured e-commerce with real-time inventory, Stripe payments, and admin dashboard.','long_description'=>'Built with React + Laravel, this platform handles thousands of daily transactions.','tech_stack'=>['React','Laravel','MySQL','Redis','Stripe','Tailwind CSS'],'is_featured'=>true,'is_published'=>true,'category'=>'Web App','github_url'=>'https://github.com','live_url'=>'https://example.com'],
            ['title'=>'Real-Time Chat App','description'=>'Scalable chat supporting rooms, DMs, file sharing, and push notifications.','tech_stack'=>['React','Node.js','Socket.io','MongoDB','Redis'],'is_featured'=>true,'is_published'=>true,'category'=>'Web App','github_url'=>'https://github.com'],
            ['title'=>'DevOps Dashboard','description'=>'Unified monitoring dashboard for CI/CD pipelines, server health, and deployment logs.','tech_stack'=>['Vue.js','Laravel','Docker','AWS','PostgreSQL'],'is_featured'=>false,'is_published'=>true,'category'=>'Dashboard'],
            ['title'=>'AI Content Generator','description'=>'SaaS tool using OpenAI API to generate marketing copy, blog posts, and social content.','tech_stack'=>['Next.js','Python','OpenAI','Stripe','Supabase'],'is_featured'=>true,'is_published'=>true,'category'=>'SaaS','live_url'=>'https://example.com'],
        ];
        foreach ($projects as $i => $project) {
            Project::create(array_merge($project, ['slug' => Str::slug($project['title']).'-'.Str::random(5), 'order' => $i]));
        }

        // Experiences
        Experience::create(['company'=>'TechCorp Inc.','role'=>'Senior Full Stack Developer','description'=>'Led microservices architecture serving 500k+ users.','responsibilities'=>['Architected RESTful APIs','Mentored 3 junior devs','Reduced page load by 40%'],'tech_used'=>['React','Laravel','Docker','AWS'],'start_date'=>'2022-01-01','is_current'=>true,'location'=>'San Francisco, CA','type'=>'full-time','order'=>0]);
        Experience::create(['company'=>'StartupXYZ','role'=>'Full Stack Developer','description'=>'Sole developer — 0 to launch in 4 months.','tech_used'=>['Vue.js','Node.js','PostgreSQL'],'start_date'=>'2020-06-01','end_date'=>'2021-12-31','is_current'=>false,'location'=>'Remote','type'=>'full-time','order'=>1]);

        // Testimonials
        Testimonial::create(['name'=>'Sarah Chen','role'=>'CTO','company'=>'TechCorp Inc.','content'=>'Alex consistently delivers exceptional work. Their ability to balance technical depth with product thinking is rare. An absolute asset to any team.','rating'=>5,'is_published'=>true,'order'=>0]);
        Testimonial::create(['name'=>'Marcus Williams','role'=>'Founder','company'=>'StartupXYZ','content'=>'Brought our MVP to life in record time. Clean code, great communication, and the end result exceeded our expectations.','rating'=>5,'is_published'=>true,'order'=>1]);

        // Blog posts
        BlogPost::create([
            'title'        => 'Building a Scalable REST API with Laravel 11',
            'slug'         => 'building-scalable-rest-api-laravel-11-'.Str::random(5),
            'excerpt'      => 'A deep dive into building production-ready APIs with Laravel 11 — authentication, rate limiting, resource transformers, and testing.',
            'content'      => '<h2>Introduction</h2><p>Laravel 11 brings significant changes to how we structure applications. In this post we\'ll build a fully featured REST API from scratch, covering JWT auth, API resources, and testing strategies.</p><h2>Project Setup</h2><p>Start by creating a fresh Laravel project and installing the required packages...</p><h2>Authentication with JWT</h2><p>We\'ll use the <code>tymon/jwt-auth</code> package for stateless authentication, which is ideal for SPAs and mobile clients.</p><pre><code>composer require tymon/jwt-auth\nphp artisan vendor:publish --provider="Tymon\\JWTAuth\\Providers\\LaravelServiceProvider"\nphp artisan jwt:secret</code></pre><h2>API Resources</h2><p>Laravel\'s API resources give us a clean transformation layer between our Eloquent models and the JSON responses we send to clients.</p><blockquote>Resources give you expressive, fluent control over the transformation of your models and model collections into JSON.</blockquote><h2>Conclusion</h2><p>With these patterns in place you have a solid foundation for any production API. The full source code is available on GitHub.</p>',
            'tags'         => ['Laravel', 'PHP', 'REST API', 'Backend'],
            'is_published' => true,
            'published_at' => now()->subDays(5),
        ]);

        BlogPost::create([
            'title'        => 'React State Management in 2025: What Actually Works',
            'slug'         => 'react-state-management-2025-'.Str::random(5),
            'excerpt'      => 'Cutting through the noise — when to use useState, useReducer, Zustand, TanStack Query, or Jotai in modern React apps.',
            'content'      => '<h2>The Landscape</h2><p>State management in React has never been more fragmented. In this post I\'ll share what I\'ve learned from building production apps in 2025.</p><h2>Local State: useState & useReducer</h2><p>For component-local state, nothing beats the built-ins. <code>useState</code> for simple values, <code>useReducer</code> for anything with multiple sub-values or complex update logic.</p><h2>Server State: TanStack Query</h2><p>This is genuinely the biggest productivity boost I\'ve found. Handling loading/error/stale states manually is a solved problem — let TanStack Query do it.</p><h2>Client-Side Global State: Zustand</h2><p>For truly global UI state (modals, theme, user session), Zustand is minimal, type-safe, and stays out of your way.</p><h2>Final Thoughts</h2><p>The key insight: most "state management problems" are actually server-state problems. Reach for TanStack Query first.</p>',
            'tags'         => ['React', 'JavaScript', 'Frontend', 'State Management'],
            'is_published' => true,
            'published_at' => now()->subDays(12),
        ]);

        BlogPost::create([
            'title'        => 'CSS Variables: The Underrated Superpower',
            'slug'         => 'css-variables-underrated-superpower-'.Str::random(5),
            'excerpt'      => 'How CSS custom properties enable runtime theming, component APIs, and design tokens without any build step.',
            'content'      => '<h2>Beyond Preprocessors</h2><p>Sass variables are compile-time. CSS custom properties are runtime — and that changes everything.</p><h2>Theming Without JavaScript</h2><p>By defining your palette as CSS variables and toggling a <code>data-theme</code> attribute on the root element, you get instant theme switching with a single line of JS.</p><pre><code>[data-theme="dark"]  { --bg: #0a0a0f; --text: #f0eff6; }\n[data-theme="light"] { --bg: #f8f8fc; --text: #13121e; }</code></pre><h2>Component APIs</h2><p>Custom properties let you expose a clean API for component customisation without adding classes or props.</p><h2>Design Tokens</h2><p>Store spacing, typography, and color scales as variables. Your design system and your code stay in sync automatically.</p>',
            'tags'         => ['CSS', 'Frontend', 'Design Systems'],
            'is_published' => true,
            'published_at' => now()->subDays(20),
        ]);

        // Settings
        $settings = [
            ['key'=>'site_title',       'value'=>'Alex Morgan — Developer'],
            ['key'=>'site_description', 'value'=>'Full Stack Developer Portfolio'],
            ['key'=>'hero_tagline',     'value'=>'I build things for the web.'],
            ['key'=>'maintenance_mode', 'value'=>'0'],
            ['key'=>'google_analytics', 'value'=>''],
            ['key'=>'resume_download',  'value'=>'1'],
        ];
        foreach ($settings as $s) {
            Setting::create($s);
        }
    }
}
