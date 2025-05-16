from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import json
import google.generativeai as genai
from django.conf import settings
import traceback

genai.configure(api_key=settings.GEMINI_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_test_questions(request):
    """
    Generate test questions using Gemini based on topic and description
    """
    try:
        
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON in request body"}, status=400)
            
        topic = data.get('topic', '')
        description = data.get('description', '')
        
        if not topic:
            return JsonResponse({"error": "Topic is required"}, status=400)
        
        print(f"Generating questions for topic: {topic}")
        print(f"Description: {description}")
        
        prompt = f"""
        Based on the following topic and description, create 5 multiple-choice questions to test knowledge comprehension. 
        
        Topic: {topic}
        Description: {description}
        
        Format the questions in the following JSON structure:
        {{
            "questions": [
                {{
                    "question": "The complete question text here?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": "The exact text of the correct option"
                }},
                // more questions...
            ]
        }}
        
        Important guidelines:
        1. Create 5 questions that cover different aspects of the topic
        2. Each question should have exactly 4 options
        3. Make sure the correct answer is among the options provided
        4. Questions should test understanding, not just recall
        5. Return ONLY the JSON structure with no additional text or explanation
        """
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            
            if not response or not hasattr(response, 'text'):
                print("Received invalid response from Gemini API")
                return JsonResponse({"error": "Invalid response from Gemini API"}, status=500)
                
            response_text = response.text
            print(f"Raw Gemini response: {response_text[:100]}...")  
            
        except Exception as api_error:
            print(f"Gemini API error: {str(api_error)}")
            return JsonResponse({"error": f"Gemini API error: {str(api_error)}"}, status=500)
        
        try:
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()
                
            questions_data = json.loads(response_text)
            
        except json.JSONDecodeError as json_error:
            print(f"Failed to parse JSON from Gemini response: {str(json_error)}")
            print(f"Response text: {response_text}")
            return JsonResponse({
                "error": "Failed to parse Gemini response",
                "details": str(json_error)
            }, status=500)
            
        if "questions" not in questions_data:
            print("Missing 'questions' key in Gemini response")
            return JsonResponse({"error": "Invalid response format: missing 'questions' key"}, status=500)
            
        if len(questions_data["questions"]) != 5:
            print(f"Expected 5 questions, got {len(questions_data['questions'])}")
            
            if len(questions_data["questions"]) == 0:
                return JsonResponse({"error": "Gemini returned 0 questions"}, status=500)
                
        
        for i, question in enumerate(questions_data["questions"]):
            if not all(key in question for key in ["question", "options", "correctAnswer"]):
                print(f"Question {i} is missing required fields")
                return JsonResponse({
                    "error": f"Question {i} is missing required fields",
                    "question_data": question
                }, status=500)
                
            if question["correctAnswer"] not in question["options"]:
                print(f"Question {i}: correct answer not in options")
                
                question["correctAnswer"] = question["options"][0]
                
        print("Successfully generated and validated questions")
        return JsonResponse(questions_data)
    
    except Exception as e:
        
        print(f"Unexpected error generating questions: {str(e)}")
        traceback.print_exc()
        return JsonResponse({
            "error": "Unexpected error",
            "details": str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def evaluate_test(request):
    """
    Evaluate the test answers submitted by the user
    """
    try:
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON in request body"}, status=400)
            
        questions = data.get('questions', [])
        user_answers = data.get('userAnswers', {})
        topic = data.get('topic', '')
        
        if not questions:
            return JsonResponse({"error": "No questions provided"}, status=400)
            
        if not user_answers:
            return JsonResponse({"error": "No user answers provided"}, status=400)
        
        answers_array = [user_answers.get(str(i)) for i in range(len(questions))]
        
        correct_count = 0
        question_results = []
        
        for i, question in enumerate(questions):
            user_answer = answers_array[i] if i < len(answers_array) else None
            is_correct = user_answer == question.get('correctAnswer')
            
            if is_correct:
                correct_count += 1
                
            question_results.append({
                "question": question.get('question'),
                "userAnswer": user_answer,
                "correctAnswer": question.get('correctAnswer'),
                "correct": is_correct
            })
        
        passed = correct_count >= 3
        
        result = {
            "correctAnswers": correct_count,
            "totalQuestions": len(questions),
            "passed": passed,
            "questionResults": question_results
        }
        
        return JsonResponse(result)
    
    except Exception as e:
        print(f"Error evaluating test: {str(e)}")
        traceback.print_exc()
        return JsonResponse({
            "error": "Error evaluating test",
            "details": str(e)
        }, status=500)