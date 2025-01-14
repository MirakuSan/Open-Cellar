interface TurboSubmitEvent extends CustomEvent {
    detail: {
        formSubmission: {
            formElement: HTMLFormElement;
            fetchRequest: { headers: Record<string, string> };
        };
    };
}

declare global {
    interface WindowEventMap {
        'turbo:submit-start': CustomEvent;
        'turbo:submit-end': CustomEvent;
    }
}

const nameCheck: RegExp = /^[-_a-zA-Z0-9]{4,22}$/;
const tokenCheck: RegExp = /^[-_/+a-zA-Z0-9]{24,}$/;

document.addEventListener('submit', function (event: SubmitEvent) {
    const csrfField = (event.target as HTMLFormElement).querySelector<HTMLInputElement>('input[data-controller="csrf-protection"]');

    if (!csrfField) {
        return;
    }

    var csrfCookie = csrfField.getAttribute('data-csrf-protection-cookie-value');
    var csrfToken = csrfField.value;

    if (!csrfCookie && nameCheck.test(csrfToken)) {
        csrfField.setAttribute('data-csrf-protection-cookie-value', csrfCookie = csrfToken);
        // Fix for Uint8Array error
        const randomValues = Array.from(crypto.getRandomValues(new Uint8Array(18)));
        csrfField.defaultValue = csrfToken = btoa(String.fromCharCode(...randomValues));
    }

    if (csrfCookie && tokenCheck.test(csrfToken)) {
        var cookie = csrfCookie + '_' + csrfToken + '=' + csrfCookie + '; path=/; samesite=strict';
        document.cookie = window.location.protocol === 'https:' ? '__Host-' + cookie + '; secure' : cookie;
    }
});

document.addEventListener('turbo:submit-start', (function(this: Document, event: CustomEvent) {
    const csrfField = (event as TurboSubmitEvent).detail.formSubmission.formElement
        .querySelector<HTMLInputElement>('input[data-controller="csrf-protection"]');

    if (!csrfField) {
        return;
    }

    var csrfCookie = csrfField.getAttribute('data-csrf-protection-cookie-value');

    if (tokenCheck.test(csrfField.value) && nameCheck.test(csrfCookie!)) {
        event.detail.formSubmission.fetchRequest.headers[csrfCookie!] = csrfField.value;
    }
}) as EventListener);

document.addEventListener('turbo:submit-end', (function(this: Document, event: CustomEvent) {
    const csrfField = (event as TurboSubmitEvent).detail.formSubmission.formElement
        .querySelector<HTMLInputElement>('input[data-controller="csrf-protection"]');

    if (!csrfField) {
        return;
    }

    var csrfCookie = csrfField.getAttribute('data-csrf-protection-cookie-value');

    if (tokenCheck.test(csrfField.value) && nameCheck.test(csrfCookie!)) {
        var cookie = csrfCookie + '_' + csrfField.value + '=0; path=/; samesite=strict; max-age=0';
        document.cookie = window.location.protocol === 'https:' ? '__Host-' + cookie + '; secure' : cookie;
    }
}) as EventListener);

export default 'csrf-protection-controller';
