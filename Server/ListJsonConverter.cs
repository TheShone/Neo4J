using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

public class ListJsonConverter<T> : JsonConverter<List<T>>
{
    public override List<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.StartArray)
        {
            return JsonSerializer.Deserialize<List<T>>(ref reader, options);
        }
        else if (reader.TokenType == JsonTokenType.Null)
        {
            // Dodajte ovu sekciju kako biste rukovali null vrednostima
            reader.Read();
            return null;
        }
        return new List<T>();
    }

    public override void Write(Utf8JsonWriter writer, List<T> value, JsonSerializerOptions options)
    {
        if (value != null && value.Count > 0)
        {
            JsonSerializer.Serialize(writer, value, options);
        }
        else
        {
            writer.WriteStartArray();
            writer.WriteEndArray();
        }
    }
}