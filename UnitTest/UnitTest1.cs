using System;
using System.Diagnostics;
using MangoFramework.Infrastructure.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void SpellCode()
        {
            var name = "林雅斌";
            var letter = SpellingCode.GetSpellCode(name.Substring(0, 1));
            Debug.Print(letter);
        }
    }
}
