# Alexa Console Helper
The current Amazon Alexa Skills Console is missing some pretty key (and important) functionality: Filtering and sorting. Adding this as a bookmark in Chrome will add UI elements and functionality to add this into the page.

## Adding the bookmark
To add a bookmark that executes this Javascript in Chrome:
    1. Minify the code in in the `alexaHelper.js`
    2. Createa bookmark in Chrome with any name (I choose Alexa Console Helper)
    3. Prepend `javascript:` onto the minfied code
    4. Paste the code into the URL field on the bookmark

## Filtering
Adding filtering was a big deal, since we had ~300 Alexa skills in production. The buttons that I added are:
    - Only Certification: Show all skills currently in certification. This will show both new skills that are waiting to go live as well as live skills that have pending changes since they are technically in a certification state.
    - Only Development: Show all skills currently in development. This will show both new skills that have never gone live as well as the development version of every live skill. This gets fairly crowded.
    - Only Live: Show all skills currently live.
    - Remove Duplicates: Removes any non-live skill that has a live counterpart.
    - Clear: Show all

For example: Selecting the "Only Development" button, as well as the "Remove Duplicates" button will show you all skills that are in development that have never gone live.

## Sorting
After activating the bookmark you'll notice the addition of a "-" character next to both the "Modified" table header as well as the "Status" table header. Clicking the header words will alternate sorting the list based on that column, while also adding an arrow next to the word to indicate the sort direction.
Multiple column sorting is **not** supported.
Sorting a filtered list is supported.
Sorting by the name column is supported, but does not work well with several mixes names that include symobls and numbers.