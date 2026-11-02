import { LANGUAGES, DEFAULT_LANGUAGE } from './languages.js';
/** Tradução por chaves, com fallback para pt-BR. */
export class Localization {
 constructor(translations={},language=DEFAULT_LANGUAGE){this.translations=translations;this.language=LANGUAGES[language]?language:DEFAULT_LANGUAGE;}
 setLanguage(language){if(!LANGUAGES[language])return false;this.language=language;return true;}
 t(key,variables={}){let value=this.translations[this.language]?.[key]??this.translations[DEFAULT_LANGUAGE]?.[key]??key;return String(value).replace(/\{(\w+)\}/g,(_,name)=>variables[name]??`{${name}}`);}
 getLanguages(){return LANGUAGES;}
}
