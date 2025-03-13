import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ArticlePage from "@/pages/ArticlePage";
import CategoryPage from "@/pages/CategoryPage";
import { LangProvider } from "@/contexts/LangContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";

function Router() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/article/:slug" component={ArticlePage} />
          <Route path="/category/:slug" component={CategoryPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <Router />
        <Toaster />
      </LangProvider>
    </QueryClientProvider>
  );
}

export default App;
