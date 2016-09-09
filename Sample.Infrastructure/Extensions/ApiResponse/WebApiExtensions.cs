using System.Collections.Generic;
using System.Linq;
using System.Web.Http.ModelBinding;

namespace Sample.Infrastructure.Extensions.ApiResponse
{
    public static class WebApiExtensions
    {
        public static string GetErrorMessage(this ModelStateDictionary modelState)
        {
            if (modelState.IsValid)
            {
                return string.Empty;
            }

            var modelStateErrors = new Dictionary<string, string>();
            foreach (KeyValuePair<string, ModelState> keyModelStatePair in modelState)
            {
                string key = keyModelStatePair.Key;
                ModelErrorCollection errors = keyModelStatePair.Value.Errors;
                if (errors != null && errors.Count > 0)
                {
                    IEnumerable<string> errorMessages = errors.Select(error =>
                    {
                        if (error.Exception != null)
                        {
                            return error.Exception.Message;
                        }
                        else
                        {
                            return error.ErrorMessage;
                        }
                    }).ToArray();
                    modelStateErrors.Add(key, string.Join(",", errorMessages));
                }
            }
            return string.Join("|", modelStateErrors.Values);
        }
    }
}