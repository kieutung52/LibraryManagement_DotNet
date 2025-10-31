declare module '*.css' {
    const content: { [className: string]: string } | string;
    export default content;
}

declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.scss' {
    const content: { [className: string]: string } | string;
    export default content;
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

// Also allow importing SASS/SCSS files
declare module '*.sass' {
    const content: { [className: string]: string } | string;
    export default content;
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

