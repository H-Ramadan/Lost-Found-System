def test_simple_check():
    # اختبار بسيط يتأكد إن 1+1 بيساوي 2
    # لو النتيجة صح، الـ Pipeline هيعدي أخضر
    assert 1 + 1 == 2

def test_string_check():
    # اختبار يتأكد إن كلمة "Lost" موجودة في اسم المشروع
    project_name = "Lost and Found System"
    assert "Lost" in project_name
