// Translation.cs

using System.Collections.Generic;

namespace YourNamespace
{
    public static class Translation
    {
        private static Dictionary<string, string> _translations = new Dictionary<string, string>();

        public static void AddTranslation(string key, string value)
        {
            _translations[key] = value;
        }

        public static string Translate(string key)
        {
            return _translations.ContainsKey(key) ? _translations[key] : key;
        }
    }
}