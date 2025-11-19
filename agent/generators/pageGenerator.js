/**
 * Generates Next.js App Router page files
 */
export class PageGenerator {
  constructor(analysisReport) {
    this.analysisReport = analysisReport;
  }

  generateAppLayout() {
    return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asana Clone - Project Management',
  description: 'A modern project management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}`;
  }

  generateHomePage() {
    return `'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Section, Flex, Grid } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <Container>
          <Flex direction="col" align="center" justify="center" className="py-24">
            <h1 className="text-5xl font-bold mb-4 text-center">
              Welcome to Asana Clone
            </h1>
            <p className="text-xl mb-8 text-center max-w-2xl">
              Manage your projects and tasks efficiently with our modern project management platform
            </p>
            <Flex gap={4}>
              <Link href="/projects">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/tasks">
                <Button size="lg" variant="outline">View Tasks</Button>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Features Section */}
      <Section>
        <Container>
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <Grid columns={3} gap={6}>
            <Card>
              <CardHeader>
                <CardTitle>📋 Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize your work into projects and keep everything in one place
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>✓ Task Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track and manage individual tasks with detailed status updates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>👥 Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Work together with your team and share updates in real-time
                </p>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gray-50">
        <Container>
          <Flex direction="col" align="center" justify="center" className="py-12">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-6">Create your first project today</p>
            <Link href="/projects">
              <Button size="lg">Create Project</Button>
            </Link>
          </Flex>
        </Container>
      </Section>
    </main>
  );
}`;
  }

  generateProjectsPage() {
    return `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Section, Grid } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Form, FormField } from '@/components/Form';
import { Input } from '@/components/Input';

export default function Projects() {
  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'Project Alpha', 
      description: 'Main product development initiative',
      status: 'active',
      progress: 65,
      team: 5
    },
    { 
      id: 2, 
      name: 'Project Beta', 
      description: 'Marketing campaign and outreach',
      status: 'active',
      progress: 40,
      team: 3
    },
    { 
      id: 3, 
      name: 'Project Gamma', 
      description: 'Infrastructure and DevOps upgrade',
      status: 'planning',
      progress: 15,
      team: 4
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const newProject = {
      id: projects.length + 1,
      name: formData.name,
      description: formData.description,
      status: 'planning',
      progress: 0,
      team: 1,
    };
    setProjects([...projects, newProject]);
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  return (
    <main>
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Projects</h1>
              <p className="text-gray-600">Manage and track all your projects</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              + New Project
            </Button>
          </div>

          <Grid columns={3} gap={6}>
            {projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-semibold">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: \`\${project.progress}%\` }}
                      />
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      👥 {project.team} team members
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Link href={\`/projects/\${project.id}\`} className="flex-1">
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Button variant="ghost">Edit</Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        size="lg"
      >
        <Form onSubmit={handleCreateProject}>
          <FormField
            name="name"
            label="Project Name"
            required
          >
            <Input
              name="name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormField>
          <FormField
            name="description"
            label="Description"
          >
            <Input
              name="description"
              placeholder="Enter project description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </FormField>
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1">Create</Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </main>
  );
}`;
  }

  generateTasksPage() {
    return `'use client';

import React, { useState } from 'react';
import { Container, Section } from '@/components/Layout';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Form, FormField } from '@/components/Form';
import { Input, Select } from '@/components/Input';

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Design homepage mockup', 
      status: 'in-progress', 
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-12-20'
    },
    { 
      id: 2, 
      title: 'Setup database schema', 
      status: 'completed', 
      priority: 'high',
      assignee: 'Jane Smith',
      dueDate: '2024-12-15'
    },
    { 
      id: 3, 
      title: 'Write API documentation', 
      status: 'pending', 
      priority: 'medium',
      assignee: 'Bob Johnson',
      dueDate: '2024-12-25'
    },
    { 
      id: 4, 
      title: 'Code review for PR #42', 
      status: 'in-progress', 
      priority: 'medium',
      assignee: 'Alice Brown',
      dueDate: '2024-12-18'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  return (
    <main>
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tasks</h1>
              <p className="text-gray-600">Track and manage your tasks</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              + New Task
            </Button>
          </div>

          <div className="mb-6 flex gap-2">
            {['all', 'pending', 'in-progress', 'completed'].map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredTasks.map(task => (
              <Card key={task.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>👤 {task.assignee}</span>
                      <span>📅 {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={\`px-3 py-1 rounded-full text-sm font-medium \${priorityColors[task.priority]}\`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span className={\`px-3 py-1 rounded-full text-sm font-medium \${statusColors[task.status]}\`}>
                      {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <Form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <FormField name="title" label="Task Title" required>
            <Input name="title" placeholder="Enter task title" required />
          </FormField>
          <FormField name="priority" label="Priority">
            <Select
              name="priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
            />
          </FormField>
          <FormField name="assignee" label="Assign To">
            <Input name="assignee" placeholder="Enter assignee name" />
          </FormField>
          <FormField name="dueDate" label="Due Date">
            <Input name="dueDate" type="date" />
          </FormField>
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1">Create</Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </main>
  );
}`;
  }

  generateNotFoundPage() {
    return `'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Section, Flex } from '@/components/Layout';
import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <main>
      <Section className="min-h-screen">
        <Container>
          <Flex direction="col" align="center" justify="center" className="py-32">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl font-semibold mb-2">Page Not Found</p>
            <p className="text-gray-600 mb-8">The page you're looking for doesn't exist</p>
            <Link href="/">
              <Button size="lg">Go Home</Button>
            </Link>
          </Flex>
        </Container>
      </Section>
    </main>
  );
}`;
  }

  generateAllPages() {
    return {
      'app/layout.tsx': this.generateAppLayout(),
      'app/page.tsx': this.generateHomePage(),
      'app/projects/page.tsx': this.generateProjectsPage(),
      'app/tasks/page.tsx': this.generateTasksPage(),
      'app/not-found.tsx': this.generateNotFoundPage(),
    };
  }
}

export default PageGenerator;
