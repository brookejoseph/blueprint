import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Routine from "@/pages/routine";
import NotFound from "@/pages/not-found";
import { ConvexProviderWrapper } from "./convex";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/routine/:id" component={Routine} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ConvexProviderWrapper>
      <Router />
      <Toaster />
    </ConvexProviderWrapper>
  );
}

export default App;