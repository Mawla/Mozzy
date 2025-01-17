export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  disabled?: boolean;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}
