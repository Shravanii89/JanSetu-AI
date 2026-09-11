// JanSetu AI - ActivityFeed (Dashboard)
import React from "react";

export interface ActivityFeedProps {
  className?: string;
  children?: React.ReactNode;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ className = "", children }) => {
  return (
    <div className={`jansetu-activityfeed ${className}`}>
      {children || <span>ActivityFeed Component Placeholder</span>}
    </div>
  );
};

export default ActivityFeed;
