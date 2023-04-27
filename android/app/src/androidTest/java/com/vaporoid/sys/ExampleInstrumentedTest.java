// Copyright (C) 2023 煙人計画 <moyu@vaporoid.com>
//
// This file is part of 昭和横濱物語.
//
// 昭和横濱物語 is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// 昭和横濱物語 is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with 昭和横濱物語. If not, see <https://www.gnu.org/licenses/>.

package com.vaporoid.sys;

import static org.junit.Assert.assertEquals;

import android.content.Context;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class ExampleInstrumentedTest {
    @Test
    public void useAppContext() {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.vaporoid.sys", appContext.getPackageName());
    }

    @Test
    public void testJsonObject() throws JSONException {
        JSONObject object = new JSONObject();
        assertEquals("{}", object.toString());
        object.put("foo", 42);
        object.put("bar", "baz\"qux");
        assertEquals("{\"foo\":42,\"bar\":\"baz\\\"qux\"}", object.toString());
    }

    @Test
    public void testJsonObjectQuote() {
        String quote = JSONObject.quote("foo\nbar\tbaz\"qux");
        assertEquals("\"foo\\nbar\\tbaz\\\"qux\"", quote);
    }
}
