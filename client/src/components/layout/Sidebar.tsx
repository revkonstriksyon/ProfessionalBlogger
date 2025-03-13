import PollSection from "../sidebar/PollSection";
import SubscriptionForm from "../sidebar/SubscriptionForm";
import PopularArticles from "../sidebar/PopularArticles";
import TagsSection from "../sidebar/TagsSection";

export default function Sidebar() {
  return (
    <div className="w-full lg:w-1/3 space-y-8">
      <PollSection />
      <SubscriptionForm />
      <PopularArticles />
      <TagsSection />
    </div>
  );
}
