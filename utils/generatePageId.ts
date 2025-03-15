export function generatePageId(title: string): string {
    const titleSegments = title.split(' ');

    titleSegments[0] = titleSegments[0].toLowerCase();
    for (let i = 1; i < titleSegments.length; i++) {
        titleSegments[i] = titleSegments[i].substring(0, 1).toUpperCase() + titleSegments[i].substring(1).toLowerCase();
    }

    return titleSegments.join('');
}