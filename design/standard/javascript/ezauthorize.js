/*
 * ezauthorize: the basket and the administration's order view without inline code, so they work under a Content
 * Security Policy without 'unsafe-inline'. What the inline scripts and on...= attributes did is done here:
 *
 *   data-ezauthorize-toggle-all="RemoveProductItemDeleteList[]"
 *                          the basket's "Remove" heading checks all items, the next click unchecks them
 *   data-ezauthorize-refund-confirm="question" (with data-ezauthorize-refund-confirmed / -cancelled)
 *                          the refund form asks first (confirm()); OK tells that a log is kept and sends the form,
 *                          Cancel tells so and stops it
 *
 * Plain JavaScript, delegated listeners; works in every admin design. Set up once, however often this file is printed.
 */
( function()
{
    if ( window.eZAuthorize ) return;
    window.eZAuthorize = { 'version': 1 };

    document.addEventListener( 'click', function( e )
    {
        var link = e.target && e.target.closest ? e.target.closest( '[data-ezauthorize-toggle-all]' ) : null;
        if ( !link ) return;
        e.preventDefault();
        var on = link.getAttribute( 'data-ezauthorize-state' ) !== '1';
        link.setAttribute( 'data-ezauthorize-state', on ? '1' : '0' );
        var form = link.closest( 'form' ) || document.forms['basket'];
        if ( !form ) return;
        var name = link.getAttribute( 'data-ezauthorize-toggle-all' );
        for ( var i = 0; i < form.elements.length; i++ )
        {
            if ( form.elements[i].type == 'checkbox' && form.elements[i].name == name )
            {
                form.elements[i].checked = on;
            }
        }
    } );

    document.addEventListener( 'submit', function( e )
    {
        var form = e.target;
        if ( !form || !form.hasAttribute || !form.hasAttribute( 'data-ezauthorize-refund-confirm' ) ) return;
        if ( window.confirm( form.getAttribute( 'data-ezauthorize-refund-confirm' ) ) )
        {
            window.alert( form.getAttribute( 'data-ezauthorize-refund-confirmed' ) );
        }
        else
        {
            window.alert( form.getAttribute( 'data-ezauthorize-refund-cancelled' ) );
            e.preventDefault();
        }
    } );
} )();
