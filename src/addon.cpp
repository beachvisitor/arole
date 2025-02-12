#define _WIN32_WINNT 0x0602
#define NTDDI_VERSION NTDDI_WIN8
#include <node.h>
#include <windows.h>
#include <winuser.h>
#include <iostream>
#include <string>

namespace control {

	using namespace v8;
	using namespace std;

	class Mouse
	{
		public:
			static POINT position() {
				SetProcessDPIAware();
				POINT pos;
				GetCursorPos(&pos);
				return pos;
			}

			static void move(int x, int y) {
				SetProcessDPIAware();
				int width = GetSystemMetrics(0);
				int height = GetSystemMetrics(1);

				int absoluteX = (x * 65536) / width;
				int absoluteY = (y * 65536) / height;

				mouse_event(MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE, absoluteX, absoluteY, 0, 0);
			}

			static void leftDown() {
				process(MOUSEEVENTF_LEFTDOWN);
			}

			static void leftUp() {
				process(MOUSEEVENTF_LEFTUP);
			}

			static void rightDown() {
				process(MOUSEEVENTF_RIGHTDOWN);
			}

			static void rightUp() {
				process(MOUSEEVENTF_RIGHTUP);
			}

			static void middleDown() {
				process(MOUSEEVENTF_MIDDLEDOWN);
			}

			static void middleUp() {
				process(MOUSEEVENTF_MIDDLEUP);
			}

			static void scroll(int amount) {
				INPUT input;
				input.type = INPUT_MOUSE;
				input.mi.mouseData = amount;
				input.mi.dwFlags = MOUSEEVENTF_WHEEL;
				SendInput(1, &input, sizeof(INPUT));
			}
		
		private:
			static void process(unsigned char flag) {
				INPUT input;
				input.type = INPUT_MOUSE;
				input.mi.dwFlags = flag;
				SendInput(1, &input, sizeof(INPUT));
			}
	};

	class Touch
    {
        public:
            static void down(int x, int y) {
				SetProcessDPIAware();
				auto& pointer = instance();
                InitializeTouchInjection(1, TOUCH_FEEDBACK_DEFAULT);
                pointer.pointerInfo.pointerFlags = POINTER_FLAG_DOWN | POINTER_FLAG_INRANGE | POINTER_FLAG_INCONTACT;
                position(pointer, x, y);
                InjectTouchInput(1, &pointer);
            }

            static void update(int x, int y) {
				SetProcessDPIAware();
				auto& pointer = instance();
                pointer.pointerInfo.pointerFlags = POINTER_FLAG_UPDATE | POINTER_FLAG_INRANGE | POINTER_FLAG_INCONTACT;
                position(pointer, x, y);
                InjectTouchInput(1, &pointer);
            }

            static void up(int x, int y) {
				SetProcessDPIAware();
				auto& pointer = instance();
                pointer.pointerInfo.pointerFlags = POINTER_FLAG_UP;
                pointer.pressure = 0;
                position(pointer, x, y);
                InjectTouchInput(1, &pointer);
            }
        private:
            static POINTER_TOUCH_INFO& instance() {
                static POINTER_TOUCH_INFO mainPointer = []() {
                    POINTER_TOUCH_INFO pointer;
                    memset(&pointer, 0, sizeof(POINTER_TOUCH_INFO));
                    pointer.pointerInfo.pointerType = PT_TOUCH;
                    pointer.pointerInfo.pointerId = 0;
                    pointer.touchFlags = TOUCH_FLAG_NONE;
                    pointer.touchMask = TOUCH_MASK_CONTACTAREA | TOUCH_MASK_ORIENTATION | TOUCH_MASK_PRESSURE;
                    pointer.orientation = 90;
                    pointer.pressure = 32000;
                    return pointer;
                    }();
                return mainPointer;
            }

            static void position(POINTER_TOUCH_INFO& pointer, int x, int y) {
                pointer.pointerInfo.ptPixelLocation.x = x;
                pointer.pointerInfo.ptPixelLocation.y = y;
                pointer.rcContact.top = y - 2;
                pointer.rcContact.bottom = y + 2;
                pointer.rcContact.left = x - 2;
                pointer.rcContact.right = x + 2;
            }
    };

	class Keyboard
	{
		public:
			static void down(unsigned char key) {
				process(key, 0);
			}
			
			static void up(unsigned char key) {
				process(key, KEYEVENTF_KEYUP);
			}

		private:
			static void process(unsigned char key, unsigned char flag) {
				INPUT input;
				input.type = INPUT_KEYBOARD;
				input.ki.wVk = key;
				input.ki.dwFlags = flag;
				SendInput(1, &input, sizeof(INPUT));
			}
	};

	void Initialize(Local<Object> exports) {
		NODE_SET_METHOD(exports, "mousePosition", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			POINT pos = Mouse::position();

			Local<Object> obj = Object::New(isolate);

			obj->Set(isolate->GetCurrentContext(),
				String::NewFromUtf8(isolate, "x").ToLocalChecked(),
				Number::New(isolate, pos.x)).FromJust();
			obj->Set(isolate->GetCurrentContext(),
				String::NewFromUtf8(isolate, "y").ToLocalChecked(),
				Number::New(isolate, pos.y)).FromJust();

			args.GetReturnValue().Set(obj);
		});

		NODE_SET_METHOD(exports, "mouseMove", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			int x = args[0].As<Number>()->Value();
			int y = args[1].As<Number>()->Value();
			Mouse::move(x, y);
		});

		NODE_SET_METHOD(exports, "mouseScroll", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::scroll(args[0].As<Number>()->Value());
		});

		NODE_SET_METHOD(exports, "mouseLeftDown", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::leftDown();
		});

		NODE_SET_METHOD(exports, "mouseLeftUp", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::leftUp();
		});

		NODE_SET_METHOD(exports, "mouseRightDown", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::rightDown();
		});

		NODE_SET_METHOD(exports, "mouseRightUp", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::rightUp();
		});

		NODE_SET_METHOD(exports, "mouseMiddleDown", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::middleDown();
		});

		NODE_SET_METHOD(exports, "mouseMiddleUp", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			Mouse::middleUp();
		});

		NODE_SET_METHOD(exports, "touchDown", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			int x = args[0].As<Number>()->Value();
			int y = args[1].As<Number>()->Value();
			Touch::down(x, y);
		});

		NODE_SET_METHOD(exports, "touchUpdate", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			int x = args[0].As<Number>()->Value();
			int y = args[1].As<Number>()->Value();
			Touch::update(x, y);
		});

		NODE_SET_METHOD(exports, "touchUp", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			int x = args[0].As<Number>()->Value();
			int y = args[1].As<Number>()->Value();
			Touch::up(x, y);
		});

		NODE_SET_METHOD(exports, "keyboardDown", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			uint8_t key = static_cast<uint8_t>(args[0].As<Number>()->Value());
			Keyboard::down(key);
		});

		NODE_SET_METHOD(exports, "keyboardUp", [](const FunctionCallbackInfo<Value>& args) {
			Isolate* isolate = args.GetIsolate();
			uint8_t key = static_cast<uint8_t>(args[0].As<Number>()->Value());
			Keyboard::up(key);
		});
	}

	NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
}