
/******************************************************************************
 * Define the jQuery extension as the following:
 *
 * $$.modules['jQuery'];
 *
 * Author: Edgel Young (edgel.young@gmail.com)
 *
 *****************************************************************************/
$$('jQuery', [], function() {
    return window.jQuery.noConflict(true);
});
