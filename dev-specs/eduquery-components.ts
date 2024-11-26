interface ComponentStructure {
  components: {
    layout: {
      MainLayout: string;      // Main layout wrapper with navigation
      DashboardLayout: string; // Dashboard-specific layout
      Sidebar: string;         // Navigation sidebar
      Header: string;          // Top navigation bar
      Footer: string;          // Footer component
    };
    auth: {
      LoginForm: string;
      RegisterForm: string;
      ForgotPasswordForm: string;
      AuthGuard: string;       // Protected route wrapper
    };
    ui: {
      Button: string;
      Input: string;
      Select: string;
      Modal: string;
      Card: string;
      Badge: string;
      Alert: string;
      Tooltip: string;
      Tabs: string;
      Progress: string;
      Avatar: string;
      LoadingSpinner: string;
    };
    dashboard: {
      educator: {
        ContentCreation: {
          QuizGenerator: string;
          LessonPlanBuilder: string;
          AssignmentCreator: string;
          MultimediaUploader: string;
          TemplateSelector: string;
        };
        Analytics: {
          PerformanceMetrics: string;
          StudentProgress: string;
          EngagementStats: string;
          ReportGenerator: string;
        };
      };
      student: {
        LearningPath: {
          SkillAssessment: string;
          ContentRecommendation: string;
          ProgressTracker: string;
          AchievementBoard: string;
        };
        Interactive: {
          AITutor: string;
          QuizTaker: string;
          StudyMaterials: string;
          DiscussionBoard: string;
        };
      };
      institution: {
        Analytics: {
          PerformanceDashboard: string;
          CurriculumAnalytics: string;
          StudentEngagementMetrics: string;
          TeacherPerformance: string;
        };
        Management: {
          UserManagement: string;
          CourseManagement: string;
          ResourceAllocation: string;
          LMSIntegration: string;
        };
      };
    };
    collaborative: {
      VirtualClassroom: {
        LiveSession: string;
        Whiteboard: string;
        PollCreator: string;
        QAPanel: string;
      };
      Discussion: {
        ForumList: string;
        ThreadView: string;
        CommentSection: string;
        ResourceSharing: string;
      };
    };
    marketplace: {
      ProductList: string;
      ProductDetail: string;
      Cart: string;
      Checkout: string;
      SellerDashboard: string;
      ResourceUpload: string;
    };
    shared: {
      forms: {
        FormBuilder: string;
        FormField: string;
        ValidationMessage: string;
      };
      data: {
        Table: string;
        Chart: string;
        DataGrid: string;
        FilterPanel: string;
        SearchBar: string;
      };
      feedback: {
        Rating: string;
        Review: string;
        Testimonial: string;
      };
      gamification: {
        LeaderBoard: string;
        BadgeDisplay: string;
        ProgressBar: string;
        AchievementCard: string;
      };
    };
    hooks: {
      useAuth: string;
      useForm: string;
      useQuery: string;
      useAnalytics: string;
      useNotification: string;
      useFileUpload: string;
      useVirtualClassroom: string;
    };
    contexts: {
      AuthContext: string;
      ThemeContext: string;
      NotificationContext: string;
      UserPreferencesContext: string;
    };
  };
}

// Export the interface
export type { ComponentStructure };
