import { useForm, useFieldArray, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { useState } from 'react';

import { FiFileText, FiTag, FiGitCommit, FiCode, FiPlus, FiTrash2, FiSend, FiList, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { VscLoading } from 'react-icons/vsc';


//  ZOD SCHEMA to add the validations to problem 
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], { required_error: "Difficulty is required" }),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  constraints: z.string().min(1, "Constraints are required"),
  followUpQuestion: z.string().optional(),
  hints: z.array(z.string().min(1, "Hint cannot be empty")).min(1, "At least one hint is required"),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().min(1, "Explanation is required")
  })).min(1, "At least one visible test case is required"),
  HiddenTestCases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required")
  })).min(1, "At least one hidden test case is required"),
  startCode: z.array(z.object({
    language: z.enum(['C++', 'Java', 'JavaScript']),
    initialCode: z.string().min(1, "Initial code is required")
  })).length(3),
  referenceCode: z.array(z.object({
    language: z.enum(['C++', 'Java', 'JavaScript']),
    completeCode: z.string().min(1, "Reference code is required")
  })).length(3)
});


//  REUSABLE COMPONENTS

// A styled container for each major section of the form
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white/50 backdrop-blur-xl shadow-lg rounded-xl p-6 mb-8 border border-white/30 dark:bg-gray-800 transition duration-300">
    <h2 className="text-2xl font-bold mb-5 flex items-center gap-3 text-gray-800 dark:text-white">
      {icon} {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

// A reusable, styled form field with label and error message
const FormField = ({ name, label, register, errors, as = "input", ...props }) => {
    const Component = as;
    const error = errors[name];
    return (
        <div>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">{label}</label>
            <Component
                id={name}
                {...register(name)}
                className={`
                    bg-white border border-gray-300 text-gray-900 text-sm rounded-lg 
                    focus:ring-primary focus:border-primary block w-full p-2.5 
                    placeholder-gray-400
                    ${error ? 'border-error' : 'border-gray-300'}
                    ${props.className || ''}
                `}
                {...props}
            />
            {error && <p className="mt-2 text-sm text-error flex items-center gap-1"><FiAlertCircle/> {error.message}</p>}
        </div>
    );
};

// component for selecting multiple tags
const TagsInput = ({ control, name, errors }) => {
    const allTags = [
        "Array", "Linked Lists", "Stacks", "Queues", "Hash Maps", "Hash Sets", "Trees", "Binary Search Trees",
        "Heaps", "Graphs", "Recursion", "Dynamic Programming", "Greedy Algorithms", "Divide and Conquer",
        "Sorting", "Searching", "Bit Manipulation", "Two Pointers", "Sliding Window", "Backtracking", "Trie",
        "Graph Traversal (DFS/BFS)", "Union-Find", "Segment Tree", "Fenwick Tree", "Topological Sorting",
        "Kadane’s Algorithm", "Kruskal’s Algorithm", "Dijkstra’s Algorithm", "Floyd-Warshall Algorithm",
        "Bellman-Ford Algorithm", "Algorithms", "KMP Algorithm", "Rabin-Karp Algorithm", "Boyer-Moore Algorithm",
        "Mathematics", "Basic Operations", "BFS", "DFS", "Data Structures", "Strings", "Binary Search"
    ];
    
    const { field } = useController({ name, control });
    const selectedTags = new Set(field.value || []);

    const toggleTag = (tag) => {
        const newTags = new Set(selectedTags);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        field.onChange(Array.from(newTags));
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border border-gray-300">
                {allTags.map(tag => (
                    <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`
                            px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-all duration-200
                            ${selectedTags.has(tag) 
                                ? 'bg-primary text-primary-content shadow-md' 
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }
                        `}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            {errors.tags && <p className="mt-2 text-sm text-error flex items-center gap-1"><FiAlertCircle/> {errors.tags.message}</p>}
        </div>
    );
};



export default function ProblemCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      constraints: '',
      followUpQuestion: '',
      hints: [''],
      tags: [],
      visibleTestCases: [{ input: '', output: '', explanation: '' }],
      HiddenTestCases: [{ input: '', output: '' }],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceCode: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'HiddenTestCases' });
  const { fields: hintsFields, append: appendHint, remove: removeHint } = useFieldArray({ control, name: 'hints' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 min-h-screen bg-base-200 text-gray-900 px-4 py-10 dark:bg-gray-900 transition duration-300">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white">
            Create New DSA Problem
          </h1>
          <p className="text-lg text-gray-600 mt-2">Fill in the details below to add a new challenge.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <SectionCard title="Problem Details" icon={<FiFileText />}>
            <FormField name="title" label="Title" register={register} errors={errors} placeholder="e.g., Two Sum" />
            
            <div>
              <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Difficulty</label>
              <select {...register("difficulty")} className={`select select-bordered w-full bg-white text-black ${errors.difficulty ? 'select-error' : ''}`}>
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {errors.difficulty && <p className="mt-2 text-sm text-error flex items-center gap-1"><FiAlertCircle/> {errors.difficulty.message}</p>}
            </div>

            <FormField name="description" label="Description" as="textarea" rows={5} register={register} errors={errors} placeholder="Provide a clear and concise problem statement." />
          </SectionCard>

          <SectionCard title="Metadata" icon={<FiTag />}>
            <TagsInput control={control} name="tags" errors={errors} />
            <FormField name="constraints" label="Constraints" as="textarea" rows={3} register={register} errors={errors} placeholder="e.g., 1 <= nums.length <= 10^4" />
            <FormField name="followUpQuestion" label="Follow-up Question (Optional)" as="textarea" rows={2} register={register} errors={errors} placeholder="e.g., Can you solve it in O(n) time complexity?" />
          </SectionCard>
          
          <SectionCard title="Hints" icon={<FiList />}>
             {hintsFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <FormField name={`hints.${index}`} label={`Hint ${index + 1}`} register={register} errors={errors.hints?.[index] || {}} placeholder="Provide a helpful hint" />
                  </div>
                  {hintsFields.length > 1 && (
                     <button type="button" className="btn btn-ghost btn-square text-error mt-8" onClick={() => removeHint(index)}><FiTrash2 size={20}/></button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-primary btn-sm" onClick={() => appendHint("")}>
                <FiPlus /> Add Hint
              </button>
          </SectionCard>

          <SectionCard title="Test Cases" icon={<FiGitCommit />}>
              <div className="p-4 rounded-lg bg-gray-50/70">
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2 text-gray-700"><FiEye /> Visible Test Cases</h3>
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-white/60 p-4 rounded-md mb-3 border-l-4 border-indigo-700 shadow-sm">
                     <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-500 mb-2">Case #{index + 1}</p>
                        <button type="button" onClick={() => removeVisible(index)} className="btn btn-ghost btn-xs text-error"><FiTrash2/></button>
                     </div>
                     <FormField name={`visibleTestCases.${index}.input`} label="Input" register={register} errors={errors.visibleTestCases?.[index] || {}} />
                     <FormField name={`visibleTestCases.${index}.output`} label="Output" register={register} errors={errors.visibleTestCases?.[index] || {}} />
                     <FormField as="textarea" name={`visibleTestCases.${index}.explanation`} label="Explanation" register={register} errors={errors.visibleTestCases?.[index] || {}} />
                  </div>
                ))}
                <button type="button" onClick={() => appendVisible({ input: "", output: "", explanation: "" })} className="btn btn-outline btn-indigo btn-sm">
                  <FiPlus /> Add Visible Case
                </button>
              </div>

              <div className="p-4 rounded-lg bg-gray-50/70 mt-4">
                 <h3 className="font-semibold mb-3 text-lg flex items-center gap-2 text-gray-700"><FiEyeOff /> Hidden Test Cases</h3>
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="bg-white/60 p-4 rounded-md mb-3 border-l-4 border-primary shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-gray-500 mb-2">Case #{index + 1}</p>
                            <button type="button" onClick={() => removeHidden(index)} className="btn btn-ghost btn-xs text-error"><FiTrash2/></button>
                        </div>
                        <FormField name={`HiddenTestCases.${index}.input`} label="Input" register={register} errors={errors.HiddenTestCases?.[index] || {}} />
                        <FormField name={`HiddenTestCases.${index}.output`} label="Output" register={register} errors={errors.HiddenTestCases?.[index] || {}} />
                    </div>
                  ))}
                  <button type="button" onClick={() => appendHidden({ input: "", output: "" })} className="btn btn-outline btn-primary btn-sm">
                    <FiPlus /> Add Hidden Case
                  </button>
              </div>
          </SectionCard>

          <SectionCard title="Code Stubs & Solutions" icon={<FiCode />}>
            {['C++', 'Java', 'JavaScript'].map((lang, i) => (
              <div key={lang} className="bg-gray-50/70 p-4 rounded-xl">
                <h3 className="font-bold text-lg text-indigo-700 mb-3">{lang}</h3>
                <FormField
    as="textarea"
    rows={8}
    name={`startCode.${i}.initialCode`}
    label="Initial Code (Boilerplate)"
    register={register}
    errors={errors.startCode?.[i] || {}}
    className="font-mono bg-gray-800 text-gray-200 w-full"
    placeholder="void solve() { ... }"
  />
  <FormField
    as="textarea"
    rows={8}
    name={`referenceCode.${i}.completeCode`}
    label="Reference Solution"
    register={register}
    errors={errors.referenceCode?.[i] || {}}
    className="font-mono bg-gray-800 text-gray-200 w-full"
    placeholder="// Full, correct solution"
  />
              </div>
            ))}
          </SectionCard>

          <div className="mt-8">
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <VscLoading className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend />
                  Submit Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
