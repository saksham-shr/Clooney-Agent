/**
 * Generates React component code from analyzed UI structure
 */
export class ReactGenerator {
  constructor(componentMap, analysisReport) {
    this.componentMap = componentMap;
    this.analysisReport = analysisReport;
  }

  generateComponentFiles() {
    const components = {};

    // Generate Button component
    components['Button.tsx'] = this.generateButtonComponent();

    // Generate Card component
    components['Card.tsx'] = this.generateCardComponent();

    // Generate Form component
    components['Form.tsx'] = this.generateFormComponent();

    // Generate Input component
    components['Input.tsx'] = this.generateInputComponent();

    // Generate Navigation component
    components['Navigation.tsx'] = this.generateNavigationComponent();

    // Generate Layout component
    components['Layout.tsx'] = this.generateLayoutComponent();

    // Generate Modal component
    components['Modal.tsx'] = this.generateModalComponent();

    // Generate index.ts for exports
    components['index.ts'] = this.generateComponentIndex();

    return components;
  }

  generateButtonComponent() {
    return `'use client';

import React from 'react';

export const Button = React.forwardRef(({ 
  variant = 'default', 
  size = 'default', 
  disabled = false, 
  className = '',
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    ghost: 'hover:bg-gray-100 focus-visible:ring-gray-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-200',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;`;
  }

  generateCardComponent() {
    return `'use client';

import React from 'react';

export const Card = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={\`rounded-lg border border-gray-200 bg-white shadow-sm \${className}\`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={\`flex flex-col space-y-1.5 border-b border-gray-200 p-6 \${className}\`}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <h2
    ref={ref}
    className={\`text-2xl font-semibold leading-none tracking-tight \${className}\`}
    {...props}
  >
    {children}
  </h2>
));

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={\`p-6 pt-0 \${className}\`}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={\`flex items-center border-t border-gray-200 p-6 \${className}\`}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export default Card;`;
  }

  generateFormComponent() {
    return `'use client';

import React, { createContext, useContext } from 'react';

const FormContext = createContext(undefined);

export const Form = ({ onSubmit, children, className = '', ...props }) => {
  const [errors, setErrors] = React.useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      await onSubmit(new FormData(e.currentTarget));
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <FormContext.Provider value={{ errors, setErrors }}>
      <form onSubmit={handleSubmit} className={className} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form');
  }
  return context;
};

export const FormField = ({ name, label, error, children, required = false }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Form;`;
  }

  generateInputComponent() {
    return `'use client';

import React from 'react';

export const Input = React.forwardRef(({ 
  type = 'text', 
  placeholder = '', 
  disabled = false,
  error = false,
  className = '',
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={\`w-full px-3 py-2 border rounded-md text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 \${
        error 
          ? 'border-red-600 focus:ring-red-600' 
          : 'border-gray-300 focus:ring-blue-600'
      } \${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} \${className}\`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ 
  placeholder = '', 
  disabled = false,
  error = false,
  className = '',
  rows = 4,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={\`w-full px-3 py-2 border rounded-md text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 \${
        error 
          ? 'border-red-600 focus:ring-red-600' 
          : 'border-gray-300 focus:ring-blue-600'
      } \${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} \${className}\`}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(({ 
  options = [], 
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      disabled={disabled}
      className={\`w-full px-3 py-2 border rounded-md text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 \${
        error 
          ? 'border-red-600 focus:ring-red-600' 
          : 'border-gray-300 focus:ring-blue-600'
      } \${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} \${className}\`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';

export default Input;`;
  }

  generateNavigationComponent() {
    return `'use client';

import React from 'react';
import Link from 'next/link';

export const Navigation = ({ items = [], className = '', activeHref = '' }) => {
  return (
    <nav className={\`flex items-center gap-6 \${className}\`}>
      {items.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className={\`text-sm font-medium transition-colors hover:text-blue-600 \${
            activeHref === item.href 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-700'
          }\`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={\`flex items-center gap-2 text-sm \${className}\`}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-blue-600 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Navigation;`;
  }

  generateLayoutComponent() {
    return `'use client';

import React from 'react';

export const Container = ({ children, className = '', size = 'default' }) => {
  const sizes = {
    sm: 'max-w-2xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'w-full',
  };

  return (
    <div className={\`mx-auto px-4 \${sizes[size]} \${className}\`}>
      {children}
    </div>
  );
};

export const Grid = ({ children, columns = 3, gap = 4, className = '' }) => {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const gapClass = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  };

  return (
    <div className={\`grid \${colClass[columns]} \${gapClass[gap]} \${className}\`}>
      {children}
    </div>
  );
};

export const Flex = ({ 
  children, 
  direction = 'row', 
  justify = 'start', 
  align = 'start', 
  gap = 4,
  className = '' 
}) => {
  const dirClass = direction === 'col' ? 'flex-col' : 'flex-row';
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  const gapClass = \`gap-\${gap}\`;

  return (
    <div className={\`flex \${dirClass} \${justifyClass[justify]} \${alignClass[align]} \${gapClass} \${className}\`}>
      {children}
    </div>
  );
};

export const Section = ({ children, className = '', id = '' }) => {
  return (
    <section id={id} className={\`py-12 \${className}\`}>
      {children}
    </section>
  );
};

export default Container;`;
  }

  generateModalComponent() {
    return `'use client';

import React, { useEffect } from 'react';

export const Modal = ({ 
  isOpen = false, 
  onClose, 
  title = '', 
  children,
  size = 'default',
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    default: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={\`bg-white rounded-lg shadow-lg \${sizes[size]} \${className}\`}>
        {title && (
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Dialog = Modal;

export default Modal;`;
  }

  generateComponentIndex() {
    return `export { Button } from './Button';
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
export { Form, FormField, useFormContext } from './Form';
export { Input, Textarea, Select } from './Input';
export { Navigation, Breadcrumb } from './Navigation';
export { Container, Grid, Flex, Section } from './Layout';
export { Modal, Dialog } from './Modal';
`;
  }

  generatePageComponents() {
    const pages = {};

    pages['Home.jsx'] = `'use client';

import React from 'react';
import { Container, Section, Flex, Grid } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

export default function Home() {
  return (
    <main>
      <Section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <Container>
          <Flex direction="col" align="center" justify="center" className="py-20">
            <h1 className="text-5xl font-bold mb-4">Welcome to Asana Clone</h1>
            <p className="text-xl mb-8">Manage your projects and tasks efficiently</p>
            <Button size="lg">Get Started</Button>
          </Flex>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <Grid columns={3} gap={6}>
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Organize your work into projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Track and manage individual tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Work together with your team</p>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </Section>
    </main>
  );
}`;

    pages['Projects.jsx'] = `'use client';

import React, { useState } from 'react';
import { Container, Section, Grid } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

export default function Projects() {
  const [projects] = useState([
    { id: 1, name: 'Project Alpha', description: 'Main product development' },
    { id: 2, name: 'Project Beta', description: 'Marketing campaign' },
    { id: 3, name: 'Project Gamma', description: 'Infrastructure upgrade' },
  ]);

  return (
    <main>
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Projects</h1>
            <Button>New Project</Button>
          </div>

          <Grid columns={3} gap={6}>
            {projects.map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{project.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>
    </main>
  );
}`;

    pages['Tasks.jsx'] = `'use client';

import React, { useState } from 'react';
import { Container, Section } from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

export default function Tasks() {
  const [tasks] = useState([
    { id: 1, title: 'Design homepage', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Setup database', status: 'completed', priority: 'high' },
    { id: 3, title: 'Write documentation', status: 'pending', priority: 'medium' },
  ]);

  return (
    <main>
      <Section>
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Tasks</h1>
            <Button>New Task</Button>
          </div>

          <div className="space-y-4">
            {tasks.map(task => (
              <Card key={task.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600">Priority: {task.priority}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={\`px-3 py-1 rounded-full text-sm \${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }\`}>
                      {task.status}
                    </span>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}`;

    return pages;
  }
}

export default ReactGenerator;
