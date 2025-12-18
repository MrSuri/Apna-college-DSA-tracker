const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Topic = require('../models/Topic');
const Problem = require('../models/Problem');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_sheet_content';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Topic.deleteMany({});
    await Problem.deleteMany({});

    const topics = await Topic.insertMany([
      {
        title: 'Arrays',
        description: 'Basic and intermediate array problems',
        order: 1
      },
      {
        title: 'Strings',
        description: 'Pattern, substring and hashing based problems',
        order: 2
      },
      {
        title: 'Linked Lists',
        description: 'Operations and classic linked list problems',
        order: 3
      },
      {
        title: 'Stacks & Queues',
        description: 'LIFO / FIFO problems and applications',
        order: 4
      },
      {
        title: 'Trees',
        description: 'Binary trees and binary search trees',
        order: 5
      },
      {
        title: 'Recursion & Backtracking',
        description: 'Subset / permutation and search problems',
        order: 6
      },
      {
        title: 'Dynamic Programming',
        description: 'Classic DP patterns for interviews',
        order: 7
      },
      {
        title: 'Graphs',
        description: 'Traversal, shortest paths and topological sort',
        order: 8
      }
    ]);

    const byTitle = (title) => topics.find((t) => t.title === title);

    const arraysTopic = byTitle('Arrays');
    const stringsTopic = byTitle('Strings');
    const linkedListsTopic = byTitle('Linked Lists');
    const stacksQueuesTopic = byTitle('Stacks & Queues');
    const treesTopic = byTitle('Trees');
    const recursionTopic = byTitle('Recursion & Backtracking');
    const dpTopic = byTitle('Dynamic Programming');
    const graphsTopic = byTitle('Graphs');

    const problems = [
      // Arrays
      {
        topicId: arraysTopic._id,
        title: 'Two Sum',
        youtubeUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
        leetCodeUrl: 'https://leetcode.com/problems/two-sum/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/2-sum-check-if-pair-with-given-sum-exists-in-array/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: arraysTopic._id,
        title: 'Kadane’s Algorithm - Maximum Subarray Sum',
        youtubeUrl: 'https://www.youtube.com/watch?v=HCL4_bOd3-4',
        leetCodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: arraysTopic._id,
        title: 'Merge Overlapping Intervals',
        youtubeUrl: 'https://www.youtube.com/watch?v=2JzRBPFYbKE',
        leetCodeUrl: 'https://leetcode.com/problems/merge-intervals/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/merge-overlapping-sub-intervals/',
        difficulty: 'Medium',
        order: 3
      },

      // Strings
      {
        topicId: stringsTopic._id,
        title: 'Valid Anagram',
        youtubeUrl: 'https://www.youtube.com/watch?v=9UtInBqnCgA',
        leetCodeUrl: 'https://leetcode.com/problems/valid-anagram/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/check-if-two-strings-are-anagram/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: stringsTopic._id,
        title: 'Longest Substring Without Repeating Characters',
        youtubeUrl: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
        leetCodeUrl:
          'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/length-of-longest-substring-without-any-repeating-character/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: stringsTopic._id,
        title: 'Rabin-Karp Pattern Searching',
        youtubeUrl: 'https://www.youtube.com/watch?v=qQ8vS2btsxI',
        leetCodeUrl: '',
        codeforcesUrl: '',
        articleUrl: 'https://cp-algorithms.com/string/rabin-karp.html',
        difficulty: 'Medium',
        order: 3
      },

      // Linked Lists
      {
        topicId: linkedListsTopic._id,
        title: 'Reverse a Linked List',
        youtubeUrl: 'https://www.youtube.com/watch?v=ugQ2DVJJroc',
        leetCodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/reverse-a-linked-list/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: linkedListsTopic._id,
        title: 'Detect Cycle in a Linked List',
        youtubeUrl: 'https://www.youtube.com/watch?v=wiOo4DC5GGA',
        leetCodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: linkedListsTopic._id,
        title: 'Merge Two Sorted Lists',
        youtubeUrl: 'https://www.youtube.com/watch?v=Xb4slcp1U38',
        leetCodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/merge-two-sorted-linked-lists/',
        difficulty: 'Easy',
        order: 3
      },

      // Stacks & Queues
      {
        topicId: stacksQueuesTopic._id,
        title: 'Valid Parentheses',
        youtubeUrl: 'https://www.youtube.com/watch?v=WtWZr0AbKDY',
        leetCodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/check-for-balanced-parentheses/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: stacksQueuesTopic._id,
        title: 'Implement Stack using Queues',
        youtubeUrl: 'https://www.youtube.com/watch?v=jDZQKzEtbYQ',
        leetCodeUrl: 'https://leetcode.com/problems/implement-stack-using-queues/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/implement-stack-using-queue/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: stacksQueuesTopic._id,
        title: 'Next Greater Element',
        youtubeUrl: 'https://www.youtube.com/watch?v=Du881K7Jtk8',
        leetCodeUrl: 'https://leetcode.com/problems/next-greater-element-i/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/next-greater-element-using-stack/',
        difficulty: 'Medium',
        order: 3
      },

      // Trees
      {
        topicId: treesTopic._id,
        title: 'Binary Tree Level Order Traversal',
        youtubeUrl: 'https://www.youtube.com/watch?v=EoAsWbO7sqg',
        leetCodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/level-order-traversal-of-a-binary-tree/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: treesTopic._id,
        title: 'Diameter of Binary Tree',
        youtubeUrl: 'https://www.youtube.com/watch?v=Rezetez59Nk',
        leetCodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/calculate-the-diameter-of-a-binary-tree/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: treesTopic._id,
        title: 'Validate Binary Search Tree',
        youtubeUrl: 'https://www.youtube.com/watch?v=f-sj7I5oXEI',
        leetCodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/check-if-binary-tree-is-bst-or-not/',
        difficulty: 'Medium',
        order: 3
      },

      // Recursion & Backtracking
      {
        topicId: recursionTopic._id,
        title: 'Subsets (Power Set)',
        youtubeUrl: 'https://www.youtube.com/watch?v=REOH22Xwdkk',
        leetCodeUrl: 'https://leetcode.com/problems/subsets/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/subset-sum-sum-of-all-subsets/',
        difficulty: 'Medium',
        order: 1
      },
      {
        topicId: recursionTopic._id,
        title: 'Permutations of an Array',
        youtubeUrl: 'https://www.youtube.com/watch?v=f2ic2Rsc9pU',
        leetCodeUrl: 'https://leetcode.com/problems/permutations/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/print-all-permutations-of-a-string-array/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: recursionTopic._id,
        title: 'N-Queens',
        youtubeUrl: 'https://www.youtube.com/watch?v=i05Ju7AftcM',
        leetCodeUrl: 'https://leetcode.com/problems/n-queens/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/n-queens-problem/',
        difficulty: 'Tough',
        order: 3
      },

      // Dynamic Programming
      {
        topicId: dpTopic._id,
        title: 'Climbing Stairs',
        youtubeUrl: 'https://www.youtube.com/watch?v=Y0lT9Fck7qI',
        leetCodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/dp-1-frog-jump-dp-on-stairs/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: dpTopic._id,
        title: '0/1 Knapsack',
        youtubeUrl: 'https://www.youtube.com/watch?v=GqOmJHQZivw',
        leetCodeUrl: '',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/data-structure/0-1-knapsack-dp-19/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: dpTopic._id,
        title: 'Longest Common Subsequence',
        youtubeUrl: 'https://www.youtube.com/watch?v=PwDqpOMwg6U',
        leetCodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
        codeforcesUrl: '',
        articleUrl:
          'https://takeuforward.org/data-structure/longest-common-subsequence-dp-25/',
        difficulty: 'Medium',
        order: 3
      },

      // Graphs
      {
        topicId: graphsTopic._id,
        title: 'BFS Traversal',
        youtubeUrl: 'https://www.youtube.com/watch?v=8PoN_3jCOQI',
        leetCodeUrl: '',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/graph/breadth-first-search-bfs-graph-traversal/',
        difficulty: 'Easy',
        order: 1
      },
      {
        topicId: graphsTopic._id,
        title: 'DFS Traversal',
        youtubeUrl: 'https://www.youtube.com/watch?v=Qzf1a--rhp8',
        leetCodeUrl: '',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/graph/depth-first-search-dfs-graph-traversal/',
        difficulty: 'Medium',
        order: 2
      },
      {
        topicId: graphsTopic._id,
        title: 'Course Schedule (Topological Sort)',
        youtubeUrl: 'https://www.youtube.com/watch?v=WAOfKpxYHR8',
        leetCodeUrl: 'https://leetcode.com/problems/course-schedule/',
        codeforcesUrl: '',
        articleUrl: 'https://takeuforward.org/graph/topological-sort-algorithm-dfs-g-21/',
        difficulty: 'Medium',
        order: 3
      }
    ];

    await Problem.insertMany(problems);

    // eslint-disable-next-line no-console
    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Seed error', err);
    process.exit(1);
  }
}

seed();


