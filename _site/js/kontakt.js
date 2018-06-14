
$(document).ready(function () {

});


var langMaps = {
    en: {
        "all_fields" : "All required fields are empty.",
        "mandatory_field" : "Mandatory",
        "firstname" : "First name",
        "lastname" : "Last name",
        "email" : "E-Mail address",
        "message" : "Message"
    },
    fr: {
        "all_fields" : "Tous les champs obligatoires sont vides.",
        "mandatory_field" : "Obligatoire",
        "firstname" : "Prénom",
        "lastname" : "Nom de famille",
        "email" : "E-Mail",
        "message" : "Message"
    },
    de: {
        "all_fields" : "Alle erforderlichen Felder sind leer.",
        "mandatory_field" : "Pflichtfelder",
        "firstname" : "Vorname",
        "lastname" : "Nachname",
        "email" : "E-Mail Adresse",
        "message" : "Nachricht"
    },
    it: {
        "all_fields" : "Tutti i campi obbligatori sono vuoti.",
        "mandatory_field" : "Obbligatorio",
        "firstname" : "Nome",
        "lastname" : "Cognome",
        "email" : "Indirizzo e-mail",
        "message" : "Messaggio"
    }
}


function t(key) {
    var currentLang = document.documentElement.lang || "en";
    return langMaps[currentLang][key] || key;
}

// function radioBtnAnfrageChanged(btn) {
//     var val = $(btn).val();
//     var inputTitle = $('.input-firma-wrapper .input-title .firma');
//     var inputTitleVal = inputTitle.html();

//     $('.input-firma-wrapper').toggle((val === 'Partnerschaftsanfrage' || val === 'Anregungen'));

//     inputTitleVal = inputTitleVal.replace(/\*/g, '');
//     $('#firma').val('');

//     if (val === 'Partnerschaftsanfrage') {
//         inputTitleVal += '*';
//         $('#firma').addClass('required');
//     } else {
//         $('#firma').removeClass('required');
//     }

//     inputTitle.html(inputTitleVal);
// }

function hasAllEmptyFields(selector) {
    var reqlength = $(selector).length;
    var value = $(selector).filter(function () {
        return $.trim($(this).val()).length === 0;
    });

    return (!(value.length>=0 && (value.length !== reqlength)));
}

function checkAndSubmitContactForm() {
    // sendContactClick('senden');

    //declare all fields
    var formFields = {
        anfrage: $('.radio-button-form[name="inquiry"]:checked').val(),
        gender: $('.radio-button-form[name="gender"]:checked').val(),
        firma: $('#firma').val(),
        vorname: $('#vorname').val(),
        nachname: $('#nachname').val(),
        email: $('#email').val(),
        telefon: $('#telefon').val(),
        nachricht: $('#nachricht').val()
    };

    //validate all required fields
    if (hasAllEmptyFields(".form-container .required")) {
        alert( t('all_fields'));
        // sendContactResult('negative-all-required-fields-empty')
        return false;
    }

    if (formFields.vorname.length === 0) {
        alert( t('mandatory_field') + ": " + t('firstname'));

        // sendContactResult('negative-vorname');
        return false;

    } else if (formFields.nachname.length === 0) {
        alert( t('mandatory_field') + ": " + t('lastname'));
        // sendContactResult('negative-nachname');
        return false;

    } else if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formFields.email))) {
        alert( t('mandatory_field') + ": " + t('email'));
        // sendContactResult('negative-email');
        return false;

    } else if (formFields.nachricht.length === 0) {
        alert( t('mandatory_field') + ": " + t('message'));
        // sendContactResult('negative-nachricht');
        return false;
    }

}