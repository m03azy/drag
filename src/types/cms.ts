export type ComponentType =
    | 'hero'
    | 'heading'
    | 'text'
    | 'image'
    | 'button'
    | 'features'
    | 'cta'
    | 'pricing'
    | 'testimonials'
    | 'accordion'
    | 'section'
    | 'slider'
    | 'form'
    | 'navbar'
    | 'site-footer';

export interface CMSComponent {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    styles?: {
        paddingTop?: string;
        paddingBottom?: string;
        paddingLeft?: string;
        paddingRight?: string;
        marginTop?: string;
        marginBottom?: string;
        fontSize?: string;
        fontWeight?: string;
        fontStyle?: string;
        fontFamily?: string;
        textDecoration?: string;
        lineHeight?: string;
        letterSpacing?: string;
        maxWidth?: string;
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundGradient?: string;
        backgroundSize?: 'cover' | 'contain' | 'auto';
        backgroundPosition?: string;
        backgroundRepeat?: string;
        textColor?: string;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
        alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
        flexDirection?: 'row' | 'column';
        borderRadius?: string;
        display?: 'block' | 'flex' | 'grid';
        gridColumns?: string;
        gap?: string;
        border?: string;
        boxShadow?: string;
        animationType?: 'none' | 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce';
        animationDuration?: number;
        animationDelay?: number;
        animationDistance?: number;
    };
    children?: CMSComponent[];
}

export interface PageData {
    id?: string;
    title: string;
    slug: string;
    content: CMSComponent[];
}
