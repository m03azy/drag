export type ComponentType = 'hero' | 'text' | 'image' | 'button' | 'features' | 'cta';

export interface CMSComponent {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
}

export interface PageData {
    id?: string;
    title: string;
    slug: string;
    content: CMSComponent[];
}
