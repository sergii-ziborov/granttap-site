/** Password form wording, kept identical to the GrantTap app's account screens. */
export const passwordCopy = {
  en: {
    signInTitle: "Sign in with password", createTitle: "Create account",
    mode: "Account action", signIn: "Sign in", create: "Create account",
    account: "GrantTap account", login: "GrantTap login", password: "Password", confirmation: "Confirm password",
    loginRule: "Use 3–64 letters, digits, dots, underscores or hyphens.",
    passwordRule: "15–128 characters. Spaces and passphrases are welcome.",
    mismatch: "Passwords do not match.",
    signingIn: "Signing in…", creating: "Creating account…",
    incorrect: "The login or password is incorrect.",
    unavailableLogin: "This login is unavailable. Choose another login.",
    rateLimited: "Too many sign-in attempts. Try again in 15 minutes.",
    unavailable: "Sign-in is temporarily unavailable. Try again later.",
    unconfirmed: "The sign-in response could not be confirmed.",
    boundary: "Coding-provider accounts are connected separately.",
  },
  ru: {
    signInTitle: "Войти с паролем", createTitle: "Создать аккаунт",
    mode: "Действие с аккаунтом", signIn: "Войти", create: "Создать аккаунт",
    account: "Аккаунт GrantTap", login: "Логин GrantTap", password: "Пароль", confirmation: "Повторите пароль",
    loginRule: "Логин: 3–64 латинские буквы, цифры, точки, подчёркивания или дефисы.",
    passwordRule: "15–128 символов. Можно использовать пробелы и длинную фразу.",
    mismatch: "Пароли не совпадают.",
    signingIn: "Входим…", creating: "Создаём аккаунт…",
    incorrect: "Неверный логин или пароль.",
    unavailableLogin: "Этот логин недоступен. Выберите другой.",
    rateLimited: "Слишком много попыток входа. Повторите через 15 минут.",
    unavailable: "Вход временно недоступен. Повторите позже.",
    unconfirmed: "Не удалось подтвердить вход.",
    boundary: "Аккаунты coding-провайдеров подключаются отдельно.",
  },
} as const;

export type PasswordCopy = (typeof passwordCopy)["en" | "ru"];
