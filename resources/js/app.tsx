import '../css/app.css';
import './bootstrap';
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { MantineProvider, createTheme } from "@mantine/core";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const queryClient = new QueryClient();

const mantineTheme = createTheme({
  primaryColor: "indigo",
  fontFamily: "Inter, sans-serif",
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#0f172a",
      "#0a0f1e",
      "#030b1b",
      "#020610",
      "#010308",
    ],
  },
});

function MantineWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <MantineProvider 
      theme={mantineTheme} 
      forceColorScheme={resolvedTheme === "dark" ? "dark" : "light"}
    >
      {children}
    </MantineProvider>
  );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <MantineWrapper>
                        <TooltipProvider>
                            <Toaster />
                            <Sonner />
                            <App {...props} />
                        </TooltipProvider>
                    </MantineWrapper>
                </ThemeProvider>
            </QueryClientProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
