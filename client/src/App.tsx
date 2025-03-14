import { Switch, Route } from "wouter";
import { Suspense, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import MediaPage from "@/pages/MediaPage";
import SearchPage from "@/pages/SearchPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminArticles from "@/pages/AdminArticles";
import AdminArticleForm from "@/pages/AdminArticleForm";
import AdminCategories from "@/pages/AdminCategories";
import Layout from "@/components/layout/Layout";
import "./lib/i18n"; // Import i18n configuration

function Router() {
  return (
    <Switch>
      {/* Wout piblik */}
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/media" component={MediaPage} />
      <Route path="/search" component={SearchPage} />
      
      {/* Wout admin */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/articles" component={AdminArticles} />
      <Route path="/admin/articles/new" component={AdminArticleForm} />
      <Route path="/admin/articles/edit/:id" component={AdminArticleForm} />
      <Route path="/admin/categories" component={AdminCategories} />
      
      {/* Wout pa jwenn */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Set initial language tag on html element
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang) {
      document.documentElement.lang = storedLang;
    }
  }, []);

  // Verifye si n ap itilize yon paj admin
  const isAdminRoute = () => {
    const path = window.location.pathname;
    return path.startsWith('/admin');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
        {isAdminRoute() ? (
          <Router />
        ) : (
          <Layout>
            <Router />
          </Layout>
        )}
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
