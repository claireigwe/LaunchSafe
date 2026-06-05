const fs = require('fs');
const path = require('path');

function readJson(filename) {
    const filePath = path.join(__dirname, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
}

function processTokens(obj, prefix = '') {
    let cssVars = [];

    for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}-${key}` : key;
        
        if (typeof value === 'string') {
            // Check if it's a reference like {color.key.primary}
            let cssValue = value;
            if (value.startsWith('{') && value.endsWith('}')) {
                const referencePath = value.slice(1, -1).replace(/\./g, '-');
                cssValue = `var(--${referencePath})`;
            }
            cssVars.push(`--${currentPath}: ${cssValue};`);
        } else if (typeof value === 'number') {
            cssVars.push(`--${currentPath}: ${value}px;`);
        } else if (typeof value === 'object' && value !== null) {
            if (value.type === 'custom-fontStyle' && value.value) {
                // Specifically for typography custom-fontStyle format
                for (const [propKey, propValue] of Object.entries(value.value)) {
                    let cssPropValue = propValue;
                    if (typeof propValue === 'number' && ['fontSize', 'lineHeight', 'letterSpacing', 'paragraphSpacing', 'paragraphIndent'].includes(propKey)) {
                        cssPropValue = `${propValue}px`;
                    }
                    cssVars.push(`--${currentPath}-${propKey}: ${cssPropValue};`);
                }
            } else if (value.type && value.value !== undefined) {
                // Handle design token format with type and value
                let cssValue = value.value;
                if (typeof cssValue === 'string' && cssValue.startsWith('{') && cssValue.endsWith('}')) {
                    const referencePath = cssValue.slice(1, -1).replace(/\./g, '-');
                    cssValue = `var(--${referencePath})`;
                } else if (value.type === 'dimension' && typeof cssValue === 'number') {
                    cssValue = `${cssValue}px`;
                }
                cssVars.push(`--${currentPath}: ${cssValue};`);
            } else {
                // Recursively process nested objects
                cssVars = cssVars.concat(processTokens(value, currentPath));
            }
        }
    }

    return cssVars;
}

function generateCSS() {
    try {
        const colors = readJson('color.json');
        const typography = readJson('typography.json');

        const colorVars = processTokens(colors);
        const typographyVars = processTokens(typography);

        const cssContent = `:root {\n  /* Colors */\n  ${colorVars.join('\n  ')}\n\n  /* Typography */\n  ${typographyVars.join('\n  ')}\n}\n`;

        fs.writeFileSync(path.join(__dirname, 'variables.css'), cssContent, 'utf8');
        console.log('Successfully generated variables.css');
    } catch (error) {
        console.error('Error generating CSS:', error.message);
    }
}

generateCSS();
