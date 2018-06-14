$(document).ready(function () {
  $('.year').click(function () {
    checkDisplayDropdown(this);
  });
});

$(document).mouseup(function (e) {
  var container = $('.dropdown-content');
  // if the target of the click isn't the container nor a descendant of the container
  if (!container.is(e.target) && container.has(e.target).length === 0 && !$(e.target).hasClass('dropdown-button') && $(e.target).parent('.dropdown-button').length === 0) {
    container.hide();
  }
});

var currentLang = document.documentElement.lang;

function checkDisplayDropdown(selection) {
  var display = $(selection).find('.dropdown-content').css('display');
  $('.dropdown-content').hide();

  if (display === 'block') {
    $(selection).find('.dropdown-content').css('display', 'none');
  } else {
    $(selection).find('.dropdown-content').css('display', 'block');
  }
}

function hideDropdown(dropdown) {
  var element = $('.' + dropdown + ' .text').parents('.select-col');
  element.hide();
}

function showDropdown(dropdown) {
  var element = $('.' + dropdown + ' .text').parents('.select-col');
  element.show();
}

function disableDropdown(dropdown) {
  var element = $('.' + dropdown + ' .text');
  element.css('color', 'gray');
  element.find('img').attr('src', '/assets/chevron-down-small-disabled.svg');
  var dropdown_button = $('.' + dropdown + ' .dropdown-button');
  dropdown_button.unbind();
}

function enableDropdown(dropdown) {
  var element = $('.' + dropdown + ' .text');
  element.css('color', '#001155');
  element.find('img').attr('src', '/assets/chevron-down-small.svg');

  var dropdown_button = $('.' + dropdown + ' .dropdown-button');
  dropdown_button.unbind();
  dropdown_button.on('click', function () {
    checkDisplayDropdown($(this).parent());
  });
}

function defaultDropdownText(dropdown) {
  var element = $('.' + dropdown + ' .text').find('div');
  element.attr('data-value', '');
  // element.text(dropdown).css('textTransform', 'capitalize');
  if (currentLang === 'en' && dropdown === 'make') {
    element.text('Make');
  } else if (currentLang === 'fr' && dropdown === 'make') {
    element.text('Marque');
  } else if (currentLang === 'de' && dropdown === 'make') {
    element.text('Marke');
  } else if (currentLang === 'it' && dropdown === 'make') {
    element.text('Fare');
  } else if (currentLang === 'en' && dropdown === 'model') {
    element.text('Model');
  } else if (currentLang === 'fr' && dropdown === 'model') {
    element.text('Modèle');
  } else if (currentLang === 'de' && dropdown === 'model') {
    element.text('Modell');
  } else if (currentLang === 'it' && dropdown === 'model') {
    element.text('Modello');
  } else {
    element.text('Lang undefined');
  }

}

function setNoModelAvailable() {
  var element = $('.model .text').find('div');
  element.attr('data-value', '');
  if (currentLang === 'en') {
    element.text('No models');
  } else if (currentLang === 'fr') {
    element.text('Pas de modèles');
  } else if (currentLang === 'de') {
    element.text('Keine modelle');
  } else if (currentLang === 'it') {
    element.text('Nessun modello');
  } else {
    element.text('Lang undefined');
  }
}

var CompatCheck = {};

(function () {
  var BASE_URL = 'https://serene-fjord-78721.herokuapp.com/';
  var selectedYear = null;
  var selectedMake = null;

  function selectValue() {
    var dropdown = $(this).parent().prev().find('div');
    dropdown.text($(this).text());

    var newValue = $(this).data('value');
    dropdown.data('value', newValue);
    dropdown.attr('data-value', newValue);
    $(this).parent().toggle('fast');
    $(this).parent().trigger('change', newValue);
  }

  CompatCheck.generateYears = function generateYears() {
    var currentYear = new Date().getFullYear();
    for (var i = currentYear; i >= 2000; i--) {
      $('#year').append('<li data-value="' + i + '"> ' + i + ' </li>');
    }
    $('#year li').click(selectValue);
  };

  CompatCheck.getMakes = function getMakes() {
    $.get(BASE_URL + '/makes')
      .done(function (elements) {
        elements.forEach(function (make) {
          $('#carmake').append($('<li data-value="' + make.id + '">' + make.name + '</li>'));
        });
        $('#carmake li').click(selectValue);
      }).fail(function () {
      console.log('failed to get makes');
    });
  };

  CompatCheck.getModelsForMake = function getModelsForMake(makeId, year) {
    if (makeId === null || makeId === undefined || year === null || year === undefined) {
      return;
    }

    $('#carmodel').children().remove();

    $.get(BASE_URL + '/models?makeId=' + makeId + '&year=' + year)
      .done(function (result) {
        if (result.length === 0) {
          setNoModelAvailable();
          disableDropdown('model');
        } else {
          result.forEach(function (modelForYear) {
            $('#carmodel')
              .append($('<li data-value="' + modelForYear.id + '">' + modelForYear.name + '</li>'));
          });
          $('#carmodel li').click(selectValue);
        }

      }).fail(function () {
      console.log('failed to get models for make ' + makeId + ' and year ' + year);
    });

  };

  CompatCheck.getObdImageForModel = function getObdImageForModel(modelId, fnc) {
    if (modelId === null || modelId === '' || modelId === undefined) {
      return;
    }

    $.get(BASE_URL + '/compatibilityData?modelId=' + modelId + '&year=' + selectedYear)
      .done(function (result) {
        fnc(result.mimeDataName);
      }).fail(function () {
      console.log('failed to get obdimage for modelId ' + modelId);
    });
  };

  CompatCheck.init = function init(type) {
    disableDropdown('make');
    type ? disableDropdown('model') : hideDropdown('model');

    CompatCheck.generateYears();
    CompatCheck.getMakes();

    $('#year').change(function () {
      var year = $(this).prev().find('div').data('value');
      $('.result-pos').removeClass('result-display ');
      $('.result-neg').removeClass('result-display ');

      if (year === '' || year === null || year === undefined) {
        selectedYear = null;
      } else {
        selectedYear = parseInt(year);
        enableDropdown('make');
        type ? disableDropdown('model') : hideDropdown('model');
        defaultDropdownText('make');
        defaultDropdownText('model');
        if (selectedMake !== null) {
          CompatCheck.getModelsForMake(selectedMake, selectedYear);
        }
      }
    });

    $('#carmake').change(function () {
      // always reset the model whenever carmake changes
      defaultDropdownText('model');
      $('.result-pos').removeClass('result-display ');
      $('.result-neg').removeClass('result-display ');

      var make = $(this).prev().find('div').data('value');
      if (make === '' || make === null || make === undefined) {
        selectedMake = null;
      } else {
        /*
         * Hack to prevent the api call for models from > 2003
         * If type contains a value it's means the dropdown is the locator version
         */
        if (selectedYear < 2004 || type) {
          // We need to make the api call
          selectedMake = parseInt(make);
          showDropdown('model');
          enableDropdown('model');
          if (selectedYear !== null) {
            $('.spinner').css('display', 'block');
            $('.loader-wrap').css('display', 'block');
            CompatCheck.getModelsForMake(selectedMake, selectedYear);
            $('.spinner').css('display', 'none');
            $('.loader-wrap').css('display', 'none');
          }
        } else {
          // In young cars we trust
          $('.spinner').css('display', 'block');
          $('.loader-wrap').css('display', 'block');
          // Use the timeout to simulate an api call (= display a loader)
          setTimeout(function () {
            $('.spinner').css('display', 'none');
            $('.loader-wrap').css('display', 'none');
            $('.result-pos').addClass('result-display');
            $('.result-neg').removeClass('result-display');
          }, 500);
        }
      }
    });

    function compatCheck(imgUrl) {
      $('.overlap.lower').children().remove();
      if (imgUrl === null || imgUrl === '' || imgUrl === undefined) {
        $('.result-neg').addClass('result-display ');
        $('.result-pos').removeClass('result-display ');

        $('.obd-message .text').css('width', '240px');
        // sendCompatCheckResult('negative');
      } else {
        $('.result-pos').addClass('result-display');
        $('.result-neg').removeClass('result-display');

        $('.obd-message .text').css('width', '200px');
        // sendCompatCheckResult('positive');
      }
      $('.spinner').css('display', 'none');
      $('.loader-wrap').css('display', 'none');

    }

    function locator(imgUrl) {
      if (imgUrl === null || imgUrl === '' || imgUrl === undefined) {
        $('.result-neg').addClass('result-display ');
        $('.result-pos').removeClass('result-display ');
        // sendOdbLocatorResult('negative');
      } else {
        $('.result-pos').addClass('result-display');
        $('.result-neg').removeClass('result-display');

        $('.positive-icon').remove();
        $('.result-pos')
          .append($('<img class="locator-img" src="' + imgUrl + '" />'));
        // sendOdbLocatorResult('positive');
      }
      $('.spinner').css('display', 'none');
      $('.loader-wrap').css('display', 'none');

    }

    var compatCheckType = type === 'locator' ? locator : compatCheck;
    $('#carmodel').change(function () {
      $('.result-pos').removeClass('result-display ');
      $('.result-neg').removeClass('result-display ');

      $('.locator-img').remove();

      var model = $(this).prev().find('div').data('value');
      if (model === '' || model === null || model === undefined) {
        $('.overlap.lower').removeClass('locator-visible');
        return;
      }
      $('.spinner').css('display', 'block');
      $('.loader-wrap').css('display', 'block');

      CompatCheck.getObdImageForModel(model, compatCheckType);
    });
  };

})();
