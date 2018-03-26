"use strict";

(function() {
  // Table headers
  var headerDateModifiedElement = document.querySelector('thead.astro-table-header [data-index="3"]');
  var headerShowNameElement = document.querySelector('thead .skill-list-page__table-first-header-cell');
  var headerStatusElement = document.querySelector('thead.astro-table-header [data-index="4"]');

  // Table elements
  var tableElement = document.querySelector('table');
  var tableBodyElement = tableElement.querySelector('tbody');
  var rowElementList = Array.from(tableBodyElement.querySelectorAll('tr.astro-table-row'));

  // Page Header
  var pageHeaderContainer = document.querySelector('.skill-list-page__new-header');

  // Add the buttons onto the header
  var removeDuplicatesButton = createButtonToAdd('futuri__remove-duplicates', 'Remove Duplicates', removeDuplicates);
  var showOnlyLiveButton = createButtonToAdd('futuri__only-live', 'Only Live', showOnlyLive);
  var showOnlyDevButton = createButtonToAdd('futuri__only-dev', 'Only Dev', showOnlyDev);
  var showOnlyCertButton = createButtonToAdd('futuri__only-cert', 'Only Cert', showOnlyCert);
  var clearButton = createButtonToAdd('futuri__clear', 'Clear', resetTable);

  pageHeaderContainer.appendChild(clearButton);
  pageHeaderContainer.appendChild(showOnlyCertButton);
  pageHeaderContainer.appendChild(showOnlyDevButton);
  pageHeaderContainer.appendChild(showOnlyLiveButton);
  pageHeaderContainer.appendChild(removeDuplicatesButton);

  rowElementList.forEach(function(rowElement) {
    // Get the elements
    var dateModifiedElement = rowElement.querySelector('.skill-list-page__modified-column');
    var showNameElement = rowElement.querySelector('.skill-list-page__name > span:first-child');
    var skillIdElement = rowElement.querySelector('.skill-list-page__name .skill-list-page__skill-id > span');
    var statusElement = rowElement.querySelector('.skill-list-page__status-column');

    // Get their values
    var dateModified = !!dateModifiedElement ? dateModifiedElement.innerText : '';
    var showName = !!showNameElement ? showNameElement.innerText : '';
    var skillId = !!skillIdElement ? skillIdElement.innerText : '';
    var status = !!statusElement ? statusElement.innerText.toLowerCase() : '';

    // Put them on the row elements for easy sorting
    rowElement.dataset.dateModified = dateModified;
    rowElement.dataset.showName = showName;
    rowElement.dataset.skillId = skillId;
    rowElement.dataset.status = status;
  });

  // Add the after icons to the sorting headers
  addArrowForHeader(headerDateModifiedElement);
  addArrowForHeader(headerShowNameElement);
  addArrowForHeader(headerStatusElement);

  // Setup the sorting click events
  headerDateModifiedElement.addEventListener('click', handleDateSort);
  headerShowNameElement.addEventListener('click', handleNameSort);
  headerStatusElement.addEventListener('click', handleStatusSort);

  var currentRowList = [];
  clearBody();
  resetTable();

  /*
   *
   * FUNCTIONS
   *
   */
  // Put the classes that we need to make a button look active
  function activateButton(button) {
    button.classList.remove('astro__button--secondary');
    button.classList.add('astro__button--primary');
  }

  function addArrowForHeader(headerElement) {
    var arrowContainer = document.createElement('span');

    arrowContainer.classList.add('sort-arrow');
    arrowContainer.innerText = ' -';

    headerElement.appendChild(arrowContainer);
  }

  // I copied this from the internet and it looks disgusting. I know. I don't even know how it works...
  function alphaNumSort(a, b, options) {
    options = options || {};

    var EQUAL = 0;
    var GREATER = (options.direction == 'desc' ?
      -1 :
      1
    );
    var SMALLER = -GREATER;

    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi;
    var sre = /(^[ ]*|[ ]*$)/g;
    var dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
    var hre = /^0x[0-9a-f]+$/i;
    var ore = /^0/;

    var normalize = function normalize(value) {
      var string = '' + value;
      return (options.caseSensitive ?
        string :
        string.toLowerCase()
      );
    };

    // Normalize values to strings
    var x = normalize(a).replace(sre, '') || '';
    var y = normalize(b).replace(sre, '') || '';

    // chunk/tokenize
    var xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
    var yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');

    // Return immediately if at least one of the values is empty.
    if (!x && !y) return EQUAL;
    if (!x && y) return GREATER;
    if (x && !y) return SMALLER;

    // numeric, hex or date detection
    var xD = parseInt(x.match(hre)) || (xN.length != 1 && x.match(dre) && Date.parse(x));
    var yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null;
    var oFxNcL, oFyNcL;

    // first try and sort Hex codes or Dates
    if (yD) {
      if (xD < yD) return SMALLER;
      else if (xD > yD) return GREATER;
    }

    // natural sorting through split numeric strings and default strings
    for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {

      // find floats not starting with '0', string or 0 if not defined (Clint Priest)
      oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
      oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;

      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) return (isNaN(oFxNcL)) ? GREATER : SMALLER;

      // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
      else if (typeof oFxNcL !== typeof oFyNcL) {
        oFxNcL += '';
        oFyNcL += '';
      }

      if (oFxNcL < oFyNcL) return SMALLER;
      if (oFxNcL > oFyNcL) return GREATER;
    }

    return EQUAL;
  };

  // Clear the table body of rows
  function clearBody() {
    while (tableBodyElement.firstChild) {
      tableBodyElement.removeChild(tableBodyElement.firstChild);
    }
  }

  // Clear the active state from all of the search buttons
  function clearButtons() {
    deactivateButton(removeDuplicatesButton);
    deactivateButton(showOnlyLiveButton);
    deactivateButton(showOnlyDevButton);
    deactivateButton(showOnlyCertButton);
  }

  // Create Button
  function createButtonToAdd(id, name, clickHandler) {
    var button = document.createElement('button');

    button.classList.add('astro__button', 'astro__button--secondary');
    button.id = id;
    button.innerText = name;
    button.style.marginLeft = '10px';
    button.addEventListener('click', clickHandler);

    return button;
  }

  // Put the classes that we need to make a button look inactive
  function deactivateButton(button) {
    button.classList.remove('astro__button--primary');
    button.classList.add('astro__button--secondary');
  }

  function displayRows() {
    currentRowList.forEach(function(rowElement) {
      tableBodyElement.appendChild(rowElement);
    });
  }

  function handleDateSort(event) {
    var currentElement = event.currentTarget;
    var currentSortDirection = currentElement.dataset.sort;

    if (currentSortDirection == 'desc') {
      sortByDate('asc');

      currentElement.dataset.sort = 'asc';
      headerDateModifiedElement.querySelector('.sort-arrow').innerText = '▲';
      headerShowNameElement.querySelector('.sort-arrow').innerText = ' -';
      headerStatusElement.querySelector('.sort-arrow').innerText = ' -';
    } else {
      sortByDate('desc');

      currentElement.dataset.sort = 'desc';
      headerDateModifiedElement.querySelector('.sort-arrow').innerText = '▼';
      headerShowNameElement.querySelector('.sort-arrow').innerText = ' -';
      headerStatusElement.querySelector('.sort-arrow').innerText = ' -';
    }
  }

  function handleNameSort(event) {
    var currentElement = event.currentTarget;
    var currentSortDirection = currentElement.dataset.sort;

    if (currentSortDirection == 'desc') {
      sortByName('asc');

      currentElement.dataset.sort = 'asc';
      headerDateModifiedElement.querySelector('.sort-arrow').innerText = ' -';
      headerShowNameElement.querySelector('.sort-arrow').innerText = '▲';
      headerStatusElement.querySelector('.sort-arrow').innerText = ' -';
    } else {
      sortByName('desc');

      currentElement.dataset.sort = 'desc';
      headerDateModifiedElement.querySelector('.sort-arrow').innerText = ' -';
      headerShowNameElement.querySelector('.sort-arrow').innerText = '▼';
      headerStatusElement.querySelector('.sort-arrow').innerText = ' -';
    }
  }

  function handleStatusSort(event) {
    var currentElement = event.currentTarget;
    var currentSortDirection = currentElement.dataset.sort;

    if (currentSortDirection == 'desc') {
      sortByStatus('asc');

      currentElement.dataset.sort = 'asc';
      headerDateModifiedElement.querySelector('.sort-arrow').innerText = ' -';
      headerShowNameElement.querySelector('.sort-arrow').innerText = ' -';
      headerStatusElement.querySelector('.sort-arrow').innerText = '▲';
    } else {
      sortByStatus('desc');

      currentElement.dataset.sort = 'desc';
      headerDateModifiedElement.querySelector('.sort-arrow').innerText = ' -';
      headerShowNameElement.querySelector('.sort-arrow').innerText = ' -';
      headerStatusElement.querySelector('.sort-arrow').innerText = '▼';
    }
  }


  // Remove duplication function
  function removeDuplicates() {
    clearBody();
    activateButton(removeDuplicatesButton);

    currentRowList = currentRowList.filter(function(rowElement) {
      return (rowElement.dataset.status === 'live') || (rowElement.dataset.status === 'in development' && !!rowElement.dataset.skillId) || (rowElement.dataset.status === 'in certification' && !!rowElement.dataset.skillId);
    });

    displayRows();
  }

  // Reset the table to include all of the original elements
  function resetTable() {
    currentRowList = rowElementList;

    clearButtons();
    displayRows();
  }

  // Show only the certification skills
  function showOnlyCert() {
    clearBody();
    activateButton(showOnlyCertButton);

    currentRowList = currentRowList.filter(function(rowElement) {
      return rowElement.dataset.status === 'in certification';
    });

    displayRows();
  }

  // Show only the development skills
  function showOnlyDev() {
    clearBody();
    activateButton(showOnlyDevButton);

    currentRowList = currentRowList.filter(function(rowElement) {
      return rowElement.dataset.status === 'in development'
    });

    displayRows();
  }

  // Show only the live skills
  function showOnlyLive() {
    clearBody();
    activateButton(showOnlyLiveButton);

    currentRowList = currentRowList.filter(function(rowElement) {
      return rowElement.dataset.status === 'live';
    });

    displayRows();
  }

  function sort(direction, propertyA, propertyB) {
    if (direction === 'desc') {
      if (propertyA > propertyB) return -1;
      if (propertyA < propertyB) return 1;
      return 0;
    } else {
      if (propertyA < propertyB) return -1;
      if (propertyA > propertyB) return 1;
      return 0;
    }
  }

  function sortByDate(direction) {
    clearBody();

    currentRowList = [].slice.call(currentRowList).sort(function(a, b) {
      return sort(direction, new Date(a.dataset.dateModified), new Date(b.dataset.dateModified));
    });

    displayRows();
  }

  function sortByName(direction) {
    clearBody();

    currentRowList = [].slice.call(currentRowList).sort(function(a, b) {
      var aVal = a.dataset.showName.toLowerCase().replace(/[#&\,.'"-]/g, '').replace(' ', '');
      var bVal = b.dataset.showName.toLowerCase().replace(/[#&\,.'"-]/g, '').replace(' ', '');

      return alphaNumSort(aVal, bVal, { direction: direction });
    });

    displayRows();
  }

  function sortByStatus(direction) {
    clearBody();

    currentRowList = [].slice.call(currentRowList).sort(function(a, b) {
      return sort(direction, a.dataset.status.toLowerCase(), b.dataset.status.toLowerCase());
    });

    displayRows();
  }
})();