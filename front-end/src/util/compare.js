export function compareRecent( a, b ) {
    if ( a.createdAt < b.createdAt ){
        return 1;
    }
    if ( a.createdAt > b.createdAt ){
        return -1;
    }
    return 0;
}

export function compareLikes( a, b ) {
    if ( a.likes.length < b.likes.length ){
        return 1;
    }
    if ( a.likes.length > b.likes.length ){
        return -1;
    }
    return 0;
}