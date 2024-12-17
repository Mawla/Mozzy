export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  onClick?: () => void;
  level?: number;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
}
